import React,{useState} from 'react';

const Input =({type})=> {
    const [value,setValue] = useState('');
    const handleChange=(val,e)=>{
       
        switch (type) {
            case 'number':
                console.log('number case');
                const NumReg = /^[0-9]*$/ ;
                console.log(NumReg.test(val));

                if(NumReg.test(val)){
                    setValue(val);
                }

                break;
            case 'email':
                console.log('email case');
                const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                console.log(emailReg.test(val));

                if(emailReg.test(val)){
                    setValue(val);
                }
                
                break;
            case 'text':
                const textReg = /^[a-zA-Z]*$/;
                console.log(textReg.test(val));

                if(textReg.test(val)){
                    setValue(val);
                }
                break;
        
            default:
                break;
        }
    }
    return (
        <div>
           
            <input type={type} value={value} onChange={(e)=>handleChange(e.target.value,e)}/>
           
        </div>
    )

}
export default Input; 