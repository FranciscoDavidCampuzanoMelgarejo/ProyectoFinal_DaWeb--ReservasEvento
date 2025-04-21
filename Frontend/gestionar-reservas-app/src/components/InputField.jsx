export function InputField({type,name,placeholder,value,onChange,onBlur,error}){
    return(
        <div>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                required
                className={`form-control ${error ? 'input-error' : ''}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            />
             {error && (<span className="error-message"> ❗ {error}</span>)}
        </div>
    );
}