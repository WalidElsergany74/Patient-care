
import { Pages, Routes } from "@/constants";
import { IFormField, IFormFieldsVariables } from "@/types";
import { Translations } from "@/types/Translations";

interface Props extends IFormFieldsVariables {
    translations: Translations;
  }
const useFormFields = ({slug , translations }: Props  ) => {
    const loginFields = (): IFormField[] => [
        {
          label: translations.auth.login.email.label,
          name: "email",
          type: "email",
          placeholder: translations.auth.login.email.placeholder,
          autoFocus: true,
        },
        {
          label: translations.auth.login.password.label,
          name: "password",
          placeholder: translations.auth.login.password.placeholder,
          type: "password",
        },
      ];
    const registerFields = () : IFormField[] => 
        [
            {
                label : translations.auth.register.firstName.label,
                type : "text",
                placeholder : translations.auth.register.firstName.placeholder,
                autoFocus : true,
                name : "firstname"
            },
            {
                label :translations.auth.register.lastName.label,
                type : "text",
                placeholder : translations.auth.register.lastName.placeholder,
                autoFocus : true,
                name : "lastname"
            },
            
            {
                label : translations.auth.register.email.label,
                type : "email",
                placeholder : translations.auth.register.email.placeholder,
                autoFocus : true,
                name : "email"
            },
            {
                label : translations.auth.register.password.label,
                type : "password",
                placeholder :  translations.auth.register.password.placeholder,
                autoFocus : true,
                name : "password"
            },
            {
                label :  translations.auth.register.confirmPassword.label,
                type : "password",
                placeholder :  translations.auth.register.confirmPassword.placeholder,
                autoFocus : true,
                name : "confirmPassword"
            }
        ]
        const profileFields = (): IFormField[] => [
            {
              label: translations.profile.form.name.label,
              name: "username",
              type: "text",
              placeholder: translations.profile.form.name.placeholder,
              autoFocus: true,
            },
            {
              label: translations.profile.form.email.label,
              name: "email",
              type: "email",
              placeholder: translations.profile.form.email.placeholder,
            },
            {
              label: translations.profile?.form?.phone?.label,
              name: "phone",
              type: "text",
              placeholder: translations.profile.form.phone?.placeholder,
            },
            
        
          ];
        const profileDoctors = (): IFormField[] => [
            {
              label: translations.profile.form.name.label,
              name: "username",
              type: "text",
              placeholder: translations.profile.form.name.placeholder,
              autoFocus: true,
            },
            {
              label: translations.profile.form.email.label,
              name: "email",
              type: "email",
              placeholder: translations.profile.form.email.placeholder,
            },
            {
              label: translations.profile.form.bioEn?.label,
              name: "bio_en",
              type: "textarea",
              placeholder: translations.profile.form.bioEn?.placeholder,
            },
            {
              label: translations.profile.form.bioAr?.label,
              name: "bio_ar",
              type: "textarea",
              placeholder: translations.profile.form.bioAr?.placeholder,
            },
            {
              label: translations.profile.form.addressEn?.placeholder,
              name: "address_en",
              type: "textarea",
              placeholder: translations.profile.form.addressEn?.placeholder,
            },
            {
              label: translations.profile.form.addressAr?.label,
              name: "address_ar",
              type: "textarea",
              placeholder: translations.profile?.form.addressAr?.placeholder,
            },
            {
              label: translations.profile?.form.experience?.label,
              name: "experience",
              type: "number",
              placeholder: translations.profile?.form.experience?.placeholder,
            },
            
        
          ];
     
        
        

        const getFormFields = () : IFormField[] => {
            switch(slug) {
              case Pages.LOGIN :
                  return loginFields()
              case Pages.Register :
                  return registerFields()
                  case Routes.PROFILE : 
                  return profileFields()
                  case "/doctorAdmin/profile" :
                    return profileDoctors()
                  default : 
                  return []
            }
          }
  
          return {
              getFormFields
          } 

       

        }
        export default useFormFields;