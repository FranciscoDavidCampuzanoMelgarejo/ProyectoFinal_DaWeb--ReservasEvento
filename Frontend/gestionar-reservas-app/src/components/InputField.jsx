export function InputField({type,name,placeholder,value,onChange,error}){
    return(
        <div>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                required
                className="form-control"
                value={value}
                onChange={onChange}
            />
            {error && <span style={{color: 'red', fontSize:'0.9rem'}}>{error}</span>}
        </div>
    );
}