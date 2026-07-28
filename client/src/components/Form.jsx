import Button from "./Button";

function Form({ children, onSubmit, className = '', submitLabel = 'Submit', submitVariant = 'primary', submitWidth = 'auto', footer }) {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
       <div className="form-buttons">
                {footer}
        <Button type="submit" variant={submitVariant} width={submitWidth}>
          {submitLabel}
        </Button>
        </div>
    </form>
  );
}

export default Form;