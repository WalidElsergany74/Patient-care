export enum Routes {
    ROOT = '/',
    DOCTORS = 'doctors',
    REVERSATION = 'reversations',
    CONTACT = 'contact',
    AUTH = 'auth',
    PROFILE = "profile",
    ADMIN = "admin",
    DOCTORADMIN ="doctorAdmin"
  }
  
  export enum Pages {
    LOGIN = 'signin',
    Register = 'signup',
  }

  export enum InputTypes {
    TEXT = "text",
    EMAIL = "email",
    PASSWORD = "password",
    NUMBER = "number",
    DATE = "date",
    TIME = "time",
    DATE_TIME_LOCAL = "datetime-local",
    CHECKBOX = "checkbox",
    RADIO = "radio",
    SELECT = "select",
    TEXTAREA = "textarea",
    FILE = "file",
    IMAGE = "image",
    COLOR = "color",
    RANGE = "range",
    TEL = "tel",
    URL = "url",
    SEARCH = "search",
    MONTH = "month",
    WEEK = "week",
    HIDDEN = "hidden",
    MULTI_SELECT = "multi select",
  }

  export enum Directions {
    RTL = "rtl",
    LTR = "ltr",
  }
  
  export enum Languages {
    ENGLISH = "en",
    ARABIC = "ar",
  }
  export enum UserRole {
    PATIENT = "PATIENT",
    ADMIN = "ADMIN",
    DOCTOR = "DOCTOR"
  }  