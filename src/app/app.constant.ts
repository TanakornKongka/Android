export const isDev = false; //open Dev mode
//#region Please Check Development or Production
export const edsrp = "https://srp.excise.go.th"; // ecdev = ADFS Prd
export const exSrp = "https://srp.excise.go.th";

// export const edsrp = "http://srpuat.excise.go.th"; // ecdev = ADFS Dev
// export const exSrp = "http://srpuat.excise.go.th";

export const pushSenderId = "421945354962";
export const appVersion = "1.0.26"; // >= 1.0.22 Production
export const appVersionCode = "01.00.03";
export const isSandbox = false;
export const isMobileDevice = false;
//#endregion

export const TimeOutHttp = 30000; //1000 = 1 sec
export const TimeOutRegCode = 1000;
export const TimeOutLoadMore = 1000;
export const TimeOutActionSheet = 5000;
export const TimeOutGetMap = 30000;
export const IntervalCctv = 60000;
export const IntervalCarPark = 5000;
export const dummyRegId = "EDSRP_Web";
export const messagePerPage = 10;
export const isShowSuccessPopup = false;
export const defaultRegisterId = 0;
export const isLoginADFS = true; //swap Login by ADFS or AD
export const isShowNativeBadge = true; //enable Native Badge Message

export const themeColor = {
  blu: {
    light: "#DFF3FD",
    dark: "#1B93D0",
    primary: "#2DB1F3",
    secondary: "#2DB1F3",
    gradient: "linear-gradient(90deg, #2DB1F3, #9DECF2)",
  },
  ora: {
    light: "#FDEAE5",
    dark: "#F2764F",
    primary: " #FC9574",
    secondary: "#FBCF99",
    gradient: "linear-gradient(90deg, #FC9574, #FBCF99)",
  },
  gre: {
    light: "#DEF6D6",
    dark: "#22A572",
    primary: " #5ECD80",
    secondary: "#C8F0BB",
    gradient: "linear-gradient(90deg, #5ECD80, #C8F0BB)",
  },
  vio: {
    light: "#E3EFFF",
    dark: "#6273BC",
    primary: " #AA99F4",
    secondary: "#B9D4FB",
    gradient: "linear-gradient(90deg, #AA99F4, #B9D4FB)",
  },
  pin: {
    light: "#FDE6F0",
    dark: "#F55D9F",
    primary: " #F55D9F",
    secondary: "#EF9FF3",
    gradient: "linear-gradient(90deg, #F55D9F, #EF9FF3)",
  },
};

export const srpService = {
  checkVersion: {
    service: edsrp + "/EDSRP/srp/srpi0001/checkVersion",
    code: "000",
  },

  loginToken: { service: edsrp + "/EDSRP/login.html", code: "000" }, //GET
  loginAuth: { service: edsrp + "/EDSRP/j_spring_security_check", code: "001" }, //POST
  indexToken: { service: edsrp + "/EDSRP/index.html", code: "000" }, //GET
  logout: { service: edsrp + "/EDSRP/login?logout", code: "000" }, //GET

  getSession: { service: edsrp + "/EDSRP/index/getUserSession", code: "000" },
  anae0053Search: {
    service: exSrp + "/EDSRP/ana/anae0053/search",
    code: "002",
  },
  searchStoreType: {
    service: exSrp + "/EDSRP/sur/sure0001/searchStoreType",
    code: "003",
  },
  searchStoreGroup: {
    service: exSrp + "/EDSRP/sur/sure0001/searchStoreGroup",
    code: "003",
  },
  searchProvinceCode: {
    service: exSrp + "/EDSRP/sur/sure0001/searchProvinceCode",
    code: "003",
  },
  searchDistrict: {
    service: exSrp + "/EDSRP/sur/sure0001/searchAmphurCode",
    code: "003",
  },
  searchSubDistrict: {
    service: exSrp + "/EDSRP/sur/sure0001/searchTambol",
    code: "003",
  },
  searchPostCode: {
    service: exSrp + "/EDSRP/sur/sure0001/searchPoscode",
    code: "003",
  },
  searchRoundNo: {
    service: exSrp + "/EDSRP/sur/sure0001/searchRoundNo",
    code: "003",
  },
  searchDataByLicNo: {
    service: exSrp + "/EDSRP/sur/sure0001/searchDataByLicNo",
    code: "003",
  },
  searchStore: {
    service: exSrp + "/EDSRP/sur/sure0001/searchStore",
    code: "003",
  },
  searchDataByStoreId: {
    service: exSrp + "/EDSRP/sur/sure0001/searchDataByStoreId",
    code: "003",
  },
  searchBarcodeRange: {
    service: exSrp + "/EDSRP/sur/sure0002/searchBarcodeRange",
    code: "003",
  },
  searchPdtByBarcode: {
    service: exSrp + "/EDSRP/sur/sure0002/searchPdtByBarcode",
    code: "003",
  },
  searchGroup: {
    service: exSrp + "/EDSRP/sur/sure0002/searchGroup",
    code: "003",
  },
  searchBrandMainCode: {
    service: exSrp + "/EDSRP/sur/sure0002/searchBrandMainCode",
    code: "003",
  },
  searchProductCatagory: {
    service: exSrp + "/EDSRP/sur/sure0002/searchProductCatagory",
    code: "003",
  },
  searchProduct: {
    service: exSrp + "/EDSRP/sur/sure0002/searchProduct",
    code: "003",
  },
  saveStoreData: { service: exSrp + "/EDSRP/sur/sure0001/save", code: "003" },
  saveProductData: { service: exSrp + "/EDSRP/sur/sure0002/save", code: "003" },
  saveProductNonBarcodeData: {
    service: exSrp + "/EDSRP/sur/sure0002/save2",
    code: "003",
  },
  initZoneAreaByOfficeCode: {
    service: exSrp + "/EDSRP/sur/sure0001/initZoneAreaByOfficeCode",
    code: "003",
  },
  searchStoreMobile: {
    service: exSrp + "/EDSRP/sur/sure0001/searchStoreMobile",
    code: "003",
  },
  checkBlogWeb: {
    service: exSrp + "/EDSRP/sur/sure0001/checkBlogWeb",
    code: "003",
  },
  searchSizeName: {
    service: exSrp + "/EDSRP/srp/srpi0002/searchSizeName",
    code: "003",
  },
  searchDataNonBarcode: {
    service: exSrp + "/EDSRP/sur/sure0002/searchDataNonBarcode",
    code: "003",
  },
};

export const srpSerchProducePageService = {
  getSearchGroup: {
    service: exSrp + "/EDSRP/srp/srpi0001/searchGroup",
    code: "011",
  },
  getCatId: { service: exSrp + "/EDSRP/sur/suri0001/searchCatId", code: "011" },
  getBrandMain: {
    service: exSrp + "/EDSRP/srp/srpi0001/searchBrandMain",
    code: "011",
  },
  getBrandSecond: {
    service: exSrp + "/EDSRP/srp/srpi0001/searchBrandSecond",
    code: "011",
  },
  getModel: { service: exSrp + "/EDSRP/srp/srpi0001/searchModel", code: "011" },
  getSize: { service: exSrp + "/EDSRP/srp/srpi0001/searchSize", code: "011" },
  getUnit: { service: exSrp + "/EDSRP/srp/srpi0001/searchUnit", code: "011" },
  sentSearch: { service: exSrp + "/EDSRP/srp/srpi0001/search", code: "011" },
};

export enum srpSerchProduceSent {
  barCode,
  groupId,
  catId,
  brandMainCode,
  brandSecondCode,
  modelCode,
  sizeCode,
  unitCode,
  txtBarCode,
}

export const srpSerchDiscoveredPageService = {
  getSearchGroup: {
    service: exSrp + "/EDSRP/srp/srpi0001/searchGroup",
    code: "011",
  },
  getCatId: { service: exSrp + "/EDSRP/sur/suri0001/searchCatId", code: "011" },

  getIntialZone: {
    service: exSrp + "/EDSRP/sur/suri0001/initialZoneArea",
    code: "011",
  },
  getZoneCode: {
    service: exSrp + "/EDSRP/sur/suri0001/loadZoneCode",
    code: "011",
  },
  getSearchAreaCode: {
    service: exSrp + "/EDSRP/sur/suri0001/searchAreaCode",
    code: "011",
  },
  getSearchAreaBranchCode: {
    service: exSrp + "/EDSRP/sur/suri0001/searchAreaCode",
    code: "011",
  },

  getStoreType: {
    service: exSrp + "/EDSRP/sur/sure0001/searchStoreType",
    code: "011",
  },
  getStoreGroup: {
    service: exSrp + "/EDSRP/sur/sure0001/searchStoreGroup",
    code: "011",
  },

  getSurveyNo: {
    service: exSrp + "/EDSRP/sur/suri0001/searchSurveyNo",
    code: "011",
  },
  getYearSurvey: {
    service: exSrp + "/EDSRP/sur/suri0001/searchYearSurvey",
    code: "011",
  },

  getBrandMain: {
    service: exSrp + "/EDSRP/sur/suri0001/searchBrandMain",
    code: "011",
  },
  getBrandSecond: {
    service: exSrp + "/EDSRP/sur/suri0001/searchBrandSecond",
    code: "011",
  },
  getModel: { service: exSrp + "/EDSRP/sur/suri0001/searchModel", code: "011" },

  sentSearch: { service: exSrp + "/EDSRP/sur/suri0001/search", code: "011" },
  sentSearchByArea: {
    service: exSrp + "/EDSRP/sur/suri0001/searchByArea",
    code: "011",
  },

  editProduct: {
    service: exSrp + "/EDSRP/sur/suri0001/editProduct",
    code: "011",
  },
  deleteSearch: {
    service: exSrp + "/EDSRP/sur/suri0001/deleteProduct",
    code: "011",
  },

  sentSearchHighestPrice: {
    service: exSrp + "/EDSRP/sur/suri0002/search",
    code: "011",
  },
};

export enum srpSerchDiscoveredSentT {
  groupId,
  degree,
  sizeCode,
  sizeName,
  unit,
  size,
  surveyNo,
  yearSurvey,
  surveyDateTo,
  surveyDateFrom,
  userStatus,
}

export enum srpSerchDiscoveredSentP {
  groupId,
  catId,
  brandMainCode,
  brandSecondCode,
  modelCode,
  surveyNo,
  yearSurvey,
  surveyDateTo,
  surveyDateFrom,
  userStatus,
}

export enum srpSerchDiscoveredSentA {
  zoneCode,
  areaCode,
  areaBranchCode,
  storeTypeCode,
  storeGroup,
  groupId,
  catId,
  surveyNo,
  yearSurvey,
  surveyDateTo,
  surveyDateFrom,
  userStatus,
}

export enum srpSerchHighPrice {
  groupId,
  catId,
  brandMainCode,
  brandSecondCode,
  modelCode,
  storeTypeCode,
  storeGroup,
  surveyNo,
  yearSurvey,
}

export const serviceAndProductService = {
  getProductList: {
    service: exSrp + "/EDSRP/ana/anae0053/getProductList",
    code: "000",
  },
  getCustomer: {
    service: exSrp + "/EDSRP/ana/anae0053/getCustomer",
    code: "002",
  },
  sentSearch: { service: exSrp + "/EDSRP/ana/anae0053/search", code: "002" },
};

export const searchProduceService = {
  searchGroup: {
    service: exSrp + "/EDSRP/srp/srpi0001/searchGroup",
    code: "0XX",
  }, //กลุ่มสินค้า
  searchDegree: {
    service: exSrp + "/EDSRP/srp/srpi0002/searchDegree",
    code: "0XX",
  }, //ดีกรี
  searchSize: {
    service: exSrp + "/EDSRP/srp/srpi0002/searchSize",
    code: "0XX",
  }, //ขนาด(ปริมาตรบรรจุ)
  searchSizeName: {
    service: exSrp + "/EDSRP/sur/sure0002/searchSizeName",
    code: "0XX",
  }, //หน่วยบรรจุ
  searchUnit: {
    service: exSrp + "/EDSRP/srp/srpi0001/searchUnit",
    code: "0XX",
  }, //หน่วยนับ

  search: { service: exSrp + "/EDSRP/srp/srpi0002/search", code: "0XX" }, //ค้นหาเมนู1
};

export const mobileCode = {
  notConnect: "x00",
  serviceWarning: "x01",
  exception: "x02",
};
export const pageCode = {
  //APP
  core_mobile: "000",
  //PAGE
  selectusertype: "001",
  login: "002",
  menu: "003",
  canteen: "004",
  carpark: "005",
  quicktel: "006",
  hrselfservice: "007",
  message: "008",
  profile: "009",
  setting: "010",
  view_message: "011",
  survey_retail_product: "012",
};
export const saveDir = {
  startup: "startup",
  temp: "temporary",
  setting: "setting",
  // pushnoti: "pushnoti",
  profile: "profile",
  notidata: "notification_data",
  tempCanteen: "temp_canteen",
};
export const httpHeader = {
  post: {
    contentType: "application/json;charset=utf-8",
    contentTypeLogin: "application/x-www-form-urlencoded;charset=utf-8",
    uploadPhoto: "application/octet-stream",
  },
  get: {},
};
export const eLink = {
  ehr: "https://ehr.scg.co.th/irj/portal?NavigationTarget=ROLES%3A%2F%2Fportal_content%2Fcom.sap.pct%2Fevery_user%2Fcom.sap.pct.erp.common.bp_folder%2Fcom.sap.pct.erp.common.roles%2Fcom.sap.pct.erp.common.erp_common%2Fcom.sap.pct.erp.common.lpd_start_wd_abap&ApplicationParameter=&System=SAP_ECC_HumanResources&WebDynproApplication=HRESS_A_PERSINFO&WebDynproConfiguration=ZHRPA_AC_OVP_ESS_PERSINFO&WebDynproNamespace=sap&PrevNavTarget=navurl%3A%2F%2F888228d21c8e6678da147b9ee6ce1d1f&TarTitle=Personal%20Profile",
};
export const factoryData = {
  setting: {
    profile: { settingValue: "N" },
    quicktel: { settingValue: "EN" },
  },
};

export enum httpFormEnum {
  get,
  post,
}
export enum userTypeEnum {
  no,
  guest,
  employee,
}
export enum menuEnum {
  park,
  canteen,
  empSearch,
  hr,
  magazine,
  message,
  profile,
  setting,
}
export enum cctvStatusEnum {
  on,
  off,
  no,
}
export const grantType = {
  password: "password",
  refresh: "refresh_token",
  adfs: "authorization_code",
};
export const clientToken = {
  id: "employeeconnect",
  secret: "scg_employeeconnect2017",
};
export const htmlCode = {};
export const browserThemeoptions: any = {
  statusbar: {
    color: "#FFFFFF",
  },
  toolbar: {
    height: 44,
    color: "#D32F2F",
  },
  title: {
    color: "#FFFFFF",
    showPageTitle: true,
    staticText: "Sign in with Microsoft",
  },
  closeButton: {
    wwwImage: "assets/icon/close_44.png",
    wwwImagePressed: "assets/icon/close_44.png",
    align: "left",
    event: "closePressed",
  },
  backButtonCanClose: false,
  clearsessioncache: true,
  clearcache: true,
  hardwareback: false,
};
