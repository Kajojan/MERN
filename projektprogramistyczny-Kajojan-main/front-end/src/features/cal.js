import { v4 as uuidv4 } from "uuid";
 
 const month = (i) => {
    return [
      { month_Id: i, id: 1, event: [] },
      { month_Id: i, id: 2, event: [] },
      { month_Id: i, id: 3, event: [] },
      { month_Id: i, id: 4, event: [] },
      { month_Id: i, id: 5, event: [] },
      { month_Id: i, id: 6, event: [] },
      { month_Id: i, id: 7, event: [] },
      { month_Id: i, id: 8, event: [] },
      { month_Id: i, id: 9, event: [] },
      { month_Id: i, id: 10, event: [] },
      { month_Id: i, id: 11, event: [] },
      { month_Id: i, id: 12, event: [] },
      { month_Id: i, id: 13, event: [] },
      { month_Id: i, id: 14, event: [] },
      { month_Id: i, id: 15, event: [] },
      { month_Id: i, id: 16, event: [] },
      { month_Id: i, id: 17, event: [] },
      { month_Id: i, id: 18, event: [] },
      { month_Id: i, id: 19, event: [] },
      { month_Id: i, id: 20, event: [] },
      { month_Id: i, id: 21, event: [] },
      { month_Id: i, id: 22, event: [] },
      { month_Id: i, id: 23, event: [] },
      { month_Id: i, id: 24, event: [] },
      { month_Id: i, id: 25, event: [] },
      { month_Id: i, id: 26, event: [] },
      { month_Id: i, id: 27, event: [] },
      { month_Id: i, id: 28, event: [] },
      { month_Id: i, id: 29, event: [] },
      { month_Id: i, id: 30, event: [] },
      { month_Id: i, id: 31, event: [] },
    ];
  };

  // {
  //   month_Id:1,
  //   id: 30,
  //   event = 'none', {
  //     name:"nameEvent",
  //     time: [od,do,or AllDAy],

  //   }

  // }
   const daysInMonth = (currentMonth, currentYear) => {
    let days = 0;
    switch (currentMonth) {
      case 1:
        days = 31;
        break;
      case 2:
        if (
          (currentYear % 4 === 0 && currentYear % 100 != 0) ||
          currentYear % 400 == 0
        ) {
          days = 29;
        } else {
          days = 28;
        }
        break;
      case 3:
        days = 31;
        break;
      case 4:
        days = 30;
        break;
      case 5:
        days = 31;
        break;
      case 6:
        days = 30;
        break;
      case 7:
        days = 31;
        break;
      case 8:
        days = 31;
        break;
      case 9:
        days = 30;
        break;
      case 10:
        days = 31;
        break;
      case 11:
        days = 30;
        break;
      case 12:
        days = 31;
        break;
    }
    return days;
  };

export   const calendar = (user_id, name,admin_name) => {
  const currentYear = new Date().getFullYear();
    const list=[]
     for (let i = 1; i <= 12; i++) {
       const months=month(i-1)
       const days = daysInMonth(i, currentYear);
      list.push(months.slice(0,days))
     }
     const id = uuidv4()
     return {name: name, cal_id: id ,year: currentYear, cal:list, users: {admin: [[user_id,admin_name]], reader:[], spec:[]}}
   };