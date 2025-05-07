export type Translations = {
    home: {
      shortTitle: string;
      title: string;
      optimal: string;
      Health: string;
      OneClickAway: string;
      description: string;
      BookAppointment: string;
      stepSection: {
        title: string;
        description: string;
        cardOne: {
          title: string;
          description: string;
        };
        cardTwo: {
          title: string;
          description: string;
        };
        cardThree: {
          title: string;
          description: string;
        };
        cardFour: {
          title: string;
          description: string;
        };
      };
      doctorSection: {
        title: string;
        description: string;
        doctorCard: {
          name: string;
          bio: string;
          address: string;
          bookNow: string;
          viewAll: string;
          CURRENCY: string;
        };
      };
    };
    footer: {
      description: string;
      company: {
        aboutUs: string;
        terms: string;
        PrivacyPolicy: string;
        ContactUs: string;
        blog: {
          p1: string;
          p2: string;
          p3: string;
          p4: string;
        };
        contactTitle: string;
      };
    };
    doctors: {
      title: string;
      filter: string;
      filterCat: string;
    };
    singleDoctor: {
      years: string;
      About: string;
      AppointmentFee: string;
    };
    reservation: {
      myBooking: string;
      upcoming: string;
      expired: string;
      Date: string;
      Time: string;
      CancelAppointment: string;
      noExpired : string,
      noUpcoming : string,
      areSure: string;
      thisAction: string;
      deleting: string;

      slot : {
        bookWithDoctor : string,
        selectDay : string,
        selectTime : string
    },
    };
    header: {
      Home: string;
      Myreservation: string;
      Doctors: string;
      Profile: string;
      doctorDashboard : string;
      Admin: string;
      buttons: {
        login: string;
        signUp: string;
        logout: string;
      };
    };
    auth: {
      login: {
        title: string;
        name: {
          label: string;
          placeholder: string;
        };
        email: {
          label: string;
          placeholder: string;
        };
        password: {
          label: string;
          placeholder: string;
        };
        submit: string;
        authPrompt: {
          message: string;
          signUpLinkText: string;
        };
      };
      register: {
        title: string;
        firstName: {
          label: string;
          placeholder: string;
        };
        lastName: {
          label: string;
          placeholder: string;
        };
        email: {
          label: string;
          placeholder: string;
        };
        password: {
          label: string;
          placeholder: string;
        };
        confirmPassword: {
          label: string;
          placeholder: string;
        };
        submit: string;
        authPrompt: {
          message: string;
          loginLinkText: string;
        };
      };
    };
    validation: {
      firstNameRequired: string,
      lastNameRequired: string,
      validEmail: string;
      passwordMinLength: string;
      passwordMaxLength: string;
      confirmPasswordRequired: string;
      passwordMismatch: string;
      specialty : string;
    };
    messages: {
      userNotFound: string;
      incorrectPassword: string;
      loginSuccessful: string;
      bookingSuccess: string;
  bookingDelete: string;
  mustLogin: string;
  onlyPatient: string;
  invalidDoctor: string;
      unexpectedError: string;
      userAlreadyExists: string;
      accountCreated: string;
      updateProfileSucess: string;
      categoryAdded: string;
      updatecategorySucess: string;
      deleteCategorySucess: string;
      productAdded: string;
      updateProductSucess: string;
      deleteProductSucess: string;
      updateUserSucess: string;
      deleteUserSucess: string;
    };
    profile: {
      title: string;
      form: {
        name: {
          label: string;
          placeholder: string;
        };
        email: {
          label: string;
          placeholder: string;
        };
        phone?: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
            invalid: string;
          };
        };
      
      
        bioEn?: {
          label?: string;
          placeholder: string;
        };
        bioAr?: {
          label?: string;
          placeholder?: string;
        };
        addressEn?: {
          label?: string;
          placeholder?: string;
        };
        addressAr?: {
          label?: string;
          placeholder?: string;
        };
        experience?: {
          label?: string;
          placeholder?: string;
        };
      };
  
      gender: {
        label: string;
        placeholder: string;
        options : {
        male : string,
        female : string
      }
      };
      age: {
        label: string;
        placeholder: string;
      };
    };
    
      doctorDashboard: {
        sidebar: {
          home: string;
          appointments: string;
          profile: string;
          availability: string;
        };
        appointmentPage: {
          title: string;
          label: string;
          table: {
            patient: string;
            fee: string;
            actions: string;
            date: string;
            time: string;
            status: string;
          };
        };
      };
    
    
  
    
    save: string;
    edit: string;
    delete: string;
    book : string;
    cancel: string;
    submit: string;
    noDoctorsFound: string;
    close : string;
    noBookingFound: string;
    noSlots : string;
  };
  