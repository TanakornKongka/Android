export class Save {
    storeId: string;
    storeCode: string;
    storeName: string;
    storeTypeCode: string;
    storeGroupCode: string;
    provinceCode: string;
    provinceName: string;
    amphurCode: string;
    amphurName: string;
    productId: string;
    surveyPrice: number;
    yearSurvey: string;
    surveyNo: number;
    zoneCode: string;
    surveyFrom: string;

}

export class SearchData {
    productId: string;
    productName: string;
    barcode: string;
    surveyPrice: string;
    index: number;
    disable: boolean = false;
}