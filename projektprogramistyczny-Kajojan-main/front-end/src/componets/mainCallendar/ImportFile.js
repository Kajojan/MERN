import {React, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { editEvent, postEvent } from '../../features/CurrentDaySlice';

function ImportFile() {
    const [fileData, setFileData] = useState(null);
    const dispatch = useDispatch()
    const user_id = useSelector((state)=> state.user.user_id)
    const cal = useSelector((state)=>state.cal.cal)
    const handleFileSelect =  (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = JSON.parse(event.target.result);
          setFileData(json);
        };
        reader.readAsText(file);
      };
    
      const uploadFile = () => {
        if(Array.isArray(fileData)){
            fileData.forEach(element => {
                if(Array.isArray(element.event)){
                    element.event.forEach((ele)=>{
                        dispatch(postEvent(user_id, cal.cal_id, element.month_Id, element.id, ele))

                    })
                }else{
                    dispatch(postEvent(user_id, cal.cal_id, element.month_Id, element.id, element.event[0]))

                }
            });
        }else{
            if(Array.isArray(fileData.event)){
                fileData.event.forEach((ele)=>{
                    dispatch(postEvent(user_id, cal.cal_id, fileData.month_Id, fileData.id, ele))

                })
            }else{
                dispatch(postEvent(user_id, cal.cal_id, fileData.month_Id, fileData.id, fileData.event[0]))

            }

        }
      };
  return (
    <div className='ImportFile'>
    <input type="file" onChange={handleFileSelect} />
        <button onClick={uploadFile}>Upload</button>
    </div>
  )
}

export default ImportFile