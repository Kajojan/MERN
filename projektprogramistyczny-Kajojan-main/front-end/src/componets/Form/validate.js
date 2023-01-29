const validate = values => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length > 20) {
      errors.name = 'Must be 20 characters or less';
    } else if (values.name.length < 2){
      errors.name = " Must be 2 characters or more "
    } else if(values.start > values.end){
      errors.end = "End time must be after Start time"
    }
    
  
    return errors;
  };
  export default validate