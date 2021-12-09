export interface planList {
  planId: string;
  planTime: Date;
  expiryDate: Date;
  contSize: string;
  contType: string;
  vesselName: string;
  toWhere:string;

  voyage: string;
  depot:string;
  blNo: string;
  carGroupCode: string;
  operCode: string;
  planStatus: string;
  paymentStatus: string;
  documentPath: string;
  remark: string;
  KSCode: string;
  createBy:number;
  updateBy:number;
  portOfFinal:number;
}
export interface ItemData {
  id: string;
  name: string;
  type: string;
  content: string;
}
export interface kong {}
export interface plan {
  depot: string;
  blNo: string;
  vesselName: string;
  voyage: string;
  contSize: string;
  contType: string;
  remark: string;
  contaunerContent: [
    {
      containerId: string;
      containerNo: string;
      enterTime: Date;
      ctnNetWeight: string;
      serialNo: string;
    }
  ];
}
