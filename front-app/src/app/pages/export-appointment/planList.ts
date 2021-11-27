

export interface planList {
    planId:string;
    plan_time: Date;
    exp_time: Date;
    vesselName:string;
    voyage:string;
    blNo: string;
    car_group_code: string;
    user_id: string;
    plan_status: string;
    payment_status: string;
    document_path:string;
    remark:string;
    KS_code:string;
  }
export interface ItemData {
    id: string;
    name: string;
    type: string;
    content: string;
  }
export interface plan{
  depot:string;
  blNo:string;
  vesselName:string;
  voyage:string;
  contSize:string;
  contType:string;
  remark:string;
  contaunerContent:[
    {container_id:string;
      container_no:string;
      enter_time:Date;
      ctn_net_weight:string;
      serialNo:string;
    }
  ]
}