export interface IFormField {
  name: string;
  label?: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "datetime-local"
    | "checkbox"
    | "radio"
    | "select"
    | "hidden"
    | "textarea";
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  defaultValue?: string;
  readOnly?: boolean;


  options?: {
    label: string;
    value: string;
  }[];
}

  export interface IFormFieldsVariables {
    slug: string;
  }



  export interface RawAppointment {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentTime: Date;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    createdAt: Date;
    updatedAt: Date;
    doctor: {
      price: number;
    };
    patient: {
      id: string;
      username: string;
      username_ar: string;
      image: string;
    };
  }
  