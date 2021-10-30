export interface planList {
    plan_id: string;
    plan_time: Date;
    exp_time: Date;
    vessel:string;
    voyage:string;
    bill_no: string;
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
  