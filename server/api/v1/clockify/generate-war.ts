import { useUser } from '@/composables/useUser';
import { DateRangeQuery } from '~/types/clockify-time-entry';
import { ApiResponse } from '~/types/api';
import { H3Error } from 'h3';
// import { FirebaseStorage } from 'firebase/storage';
// import { useFirebase } from '@/composables/useFirebase';
import exportService from '~/server/services/exportService';
type ReportItem = {
  columns: string[];
};
type Reports = ReportItem[];

export default defineEventHandler(async (event): Promise<ApiResponse | undefined> => {
  // Your code here
  try {
    const body = await readBody(event);
    // map the clockify entries report
    const reportItems: Reports = [];
    body.entries.map((item: any) => {
      reportItems.push({
        columns: Object.entries(item)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([key, _]) => key !== 'status')
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(([_, value]) => {
            return String(value);
          }),
      });
    });
    console.log('body.periodCovered :>> ', body.periodCovered);
    const periodCovered = formatDateRange(body.periodCovered);
    console.log('periodCovered :>> ', periodCovered);

    const user = useUser(event); // get the current user
    const userData = JSON.parse(user.data); // parse the user data
    const excelData = { ...userData, periodCovered, war: reportItems }; // add it in  excel data

    const filename = `${userData.name.replace(/ /g, '_')}_${makeUnderscored(periodCovered)}_Weekly_Accomplishment_Report.xlsx`;

    const base64Data = await exportService.generateExcel('/war-template.xlsx', excelData);
    const { fileId, folderId } = await exportService.saveToGoogleDrive(
      userData.clockifyUserId,
      filename,
      base64Data,
    );
    // const { storage }: { storage: FirebaseStorage } = useFirebase();
    // const publicUrl = await xlsxPrinterService.saveToFirebase(storage, base64Data, 'test-war.xlsx');

    return {
      success: true,
      data: { fileId, filename, folderId },
    };
  } catch (error: any) {
    console.error('Error occurred while generating the report:', error);
    const h3Error = new H3Error('Failed to generate the report.');
    h3Error.statusCode = 500;
    h3Error.data = {
      error: error.message,
    };

    throw h3Error;
  }
});

const formatDateRange = (dateRange: DateRangeQuery): string => {
  const options = { month: 'long', day: '2-digit', year: 'numeric' } as const;
  const startDate = new Date(dateRange.start as string);
  const endDate = new Date(dateRange.end as string);

  endDate.setDate(endDate.getDate() - 1);

  const formattedStartDate = startDate.toLocaleDateString('en-US', options);
  const formattedEndDate = endDate.toLocaleDateString('en-US', options);

  return `${formattedStartDate} - ${formattedEndDate}`;
};
const makeUnderscored = (str: string) => str.replace(/ /g, '_');
