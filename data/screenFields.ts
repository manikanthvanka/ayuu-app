
export interface ScreenField {
  id: string;
  key: string;
  label: string;
  value: string;
  description: string;
  screen: string;
  fieldType?: 'text' | 'input' | 'checkbox' | 'select' | 'textarea' | 'number' | 'date';
  isRequired?: boolean;
  isEnabled?: boolean;
  options?: string[]; // For select fields
}

export const allScreenFields: ScreenField[] = [
  // Patient Search Screen Fields
  {
    id: 'search_1',
    key: 'page_title',
    label: 'Page Title',
    value: 'Patient Search',
    description: 'Main page title for patient search',
    screen: 'search',
    fieldType: 'text'
  },
  {
    id: 'search_2',
    key: 'patient_id_prefix',
    label: 'Patient ID Prefix',
    value: 'MR',
    description: 'Prefix for patient identifier (e.g., MR, ARU, PT)',
    screen: 'search',
    fieldType: 'text'
  },
  {
    id: 'search_3',
    key: 'patient_id_label',
    label: 'Patient ID Label',
    value: 'MR Number',
    description: 'Display label for patient identifier field',
    screen: 'search',
    fieldType: 'text'
  },
  {
    id: 'search_4',
    key: 'patient_id_placeholder',
    label: 'Patient ID Placeholder',
    value: 'Enter number only',
    description: 'Placeholder text for patient ID input',
    screen: 'search',
    fieldType: 'text'
  },
  {
    id: 'search_5',
    key: 'name_phone_label',
    label: 'Name/Phone Label',
    value: 'Name or Phone',
    description: 'Label for name/phone search field',
    screen: 'search',
    fieldType: 'text'
  },
  {
    id: 'search_6',
    key: 'search_button_text',
    label: 'Search Button Text',
    value: 'Search Patient',
    description: 'Text for the search button',
    screen: 'search',
    fieldType: 'text'
  },

  // Dashboard Screen Fields
  {
    id: 'dashboard_1',
    key: 'page_title',
    label: 'Page Title',
    value: 'Ayuu Healthcare',
    description: 'Main page title shown in header',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_2',
    key: 'register_patient_btn',
    label: 'Register Patient Button',
    value: 'Register Patient',
    description: 'Text for register patient button',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_3',
    key: 'book_appointment_btn',
    label: 'Book Appointment Button',
    value: 'Book Appointment',
    description: 'Text for book appointment button',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_4',
    key: 'patient_search_btn',
    label: 'Patient Search Button',
    value: 'Patient Search',
    description: 'Text for patient search button',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_5',
    key: 'todays_appointments_card',
    label: 'Today\'s Appointments Card',
    value: 'Today\'s Appointments',
    description: 'Title for appointments statistics card',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_6',
    key: 'active_queue_card',
    label: 'Active Queue Card',
    value: 'Active Queue',
    description: 'Title for active queue statistics card',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_7',
    key: 'return_queue_card',
    label: 'Return Queue Card',
    value: 'Return Queue',
    description: 'Title for return queue statistics card',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_8',
    key: 'available_doctors_card',
    label: 'Available Doctors Card',
    value: 'Available Doctors',
    description: 'Title for available doctors statistics card',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_9',
    key: 'appointments_table_title',
    label: 'Appointments Table Title',
    value: 'Today\'s Appointments',
    description: 'Title for the appointments data table',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_10',
    key: 'token_column',
    label: 'Token Column Header',
    value: 'Token',
    description: 'Column header for token number',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_11',
    key: 'mr_number_column',
    label: 'MR Number Column Header',
    value: 'MR Number',
    description: 'Column header for MR number',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_12',
    key: 'patient_name_column',
    label: 'Patient Name Column Header',
    value: 'Patient Name',
    description: 'Column header for patient name',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_13',
    key: 'doctor_column',
    label: 'Doctor Column Header',
    value: 'Doctor',
    description: 'Column header for doctor name',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_14',
    key: 'time_column',
    label: 'Time Column Header',
    value: 'Time',
    description: 'Column header for appointment time',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_15',
    key: 'status_column',
    label: 'Status Column Header',
    value: 'Status',
    description: 'Column header for appointment status',
    screen: 'dashboard',
    fieldType: 'text'
  },
  {
    id: 'dashboard_16',
    key: 'actions_column',
    label: 'Actions Column Header',
    value: 'Actions',
    description: 'Column header for action buttons',
    screen: 'dashboard',
    fieldType: 'text'
  },

  // Patient Registration Screen Fields
  {
    id: 'registration_1',
    key: 'page_title',
    label: 'Page Title',
    value: 'Patient Registration',
    description: 'Main page title for registration',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_2',
    key: 'first_name_label',
    label: 'First Name Label',
    value: 'First Name',
    description: 'Label for first name field',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_3',
    key: 'first_name_required',
    label: 'First Name Required',
    value: 'true',
    description: 'Whether first name is required',
    screen: 'registration',
    fieldType: 'checkbox',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'registration_4',
    key: 'last_name_label',
    label: 'Last Name Label',
    value: 'Last Name',
    description: 'Label for last name field',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_5',
    key: 'last_name_required',
    label: 'Last Name Required',
    value: 'true',
    description: 'Whether last name is required',
    screen: 'registration',
    fieldType: 'checkbox',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'registration_6',
    key: 'email_label',
    label: 'Email Label',
    value: 'Email',
    description: 'Label for email field',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_7',
    key: 'email_required',
    label: 'Email Required',
    value: 'false',
    description: 'Whether email is required',
    screen: 'registration',
    fieldType: 'checkbox',
    isRequired: false,
    isEnabled: true
  },
  {
    id: 'registration_8',
    key: 'phone_label',
    label: 'Phone Number Label',
    value: 'Phone Number',
    description: 'Label for phone field',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_9',
    key: 'phone_required',
    label: 'Phone Required',
    value: 'true',
    description: 'Whether phone is required',
    screen: 'registration',
    fieldType: 'checkbox',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'registration_10',
    key: 'gender_label',
    label: 'Gender Label',
    value: 'Gender',
    description: 'Label for gender field',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_11',
    key: 'gender_required',
    label: 'Gender Required',
    value: 'true',
    description: 'Whether gender is required',
    screen: 'registration',
    fieldType: 'checkbox',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'registration_12',
    key: 'dob_label',
    label: 'Date of Birth Label',
    value: 'Date of Birth',
    description: 'Label for date of birth field',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_13',
    key: 'dob_required',
    label: 'Date of Birth Required',
    value: 'true',
    description: 'Whether date of birth is required',
    screen: 'registration',
    fieldType: 'checkbox',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'registration_14',
    key: 'address_label',
    label: 'Address Label',
    value: 'Address',
    description: 'Label for address field',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_15',
    key: 'address_required',
    label: 'Address Required',
    value: 'false',
    description: 'Whether address is required',
    screen: 'registration',
    fieldType: 'checkbox',
    isRequired: false,
    isEnabled: true
  },
  {
    id: 'registration_16',
    key: 'emergency_contact_label',
    label: 'Emergency Contact Label',
    value: 'Emergency Contact Number',
    description: 'Label for emergency contact field',
    screen: 'registration',
    fieldType: 'text'
  },
  {
    id: 'registration_17',
    key: 'emergency_contact_required',
    label: 'Emergency Contact Required',
    value: 'true',
    description: 'Whether emergency contact is required',
    screen: 'registration',
    fieldType: 'checkbox',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'registration_18',
    key: 'show_book_appointment_option',
    label: 'Show Book Appointment Option',
    value: 'true',
    description: 'Whether to show book appointment checkbox after registration',
    screen: 'registration',
    fieldType: 'checkbox',
    isEnabled: true
  },
  {
    id: 'registration_19',
    key: 'book_appointment_checkbox_label',
    label: 'Book Appointment Checkbox Label',
    value: 'Book appointment after registration',
    description: 'Label for book appointment checkbox',
    screen: 'registration',
    fieldType: 'text'
  },

  // Vitals Screen Fields
  {
    id: 'vitals_1',
    key: 'page_title',
    label: 'Page Title',
    value: 'Patient Vitals',
    description: 'Main page title for vitals',
    screen: 'vitals',
    fieldType: 'text'
  },
  {
    id: 'vitals_2',
    key: 'weight_label',
    label: 'Weight Label',
    value: 'Weight (kg)',
    description: 'Label for weight field',
    screen: 'vitals',
    fieldType: 'text'
  },
  {
    id: 'vitals_3',
    key: 'weight_enabled',
    label: 'Weight Field Enabled',
    value: 'true',
    description: 'Whether weight field is enabled',
    screen: 'vitals',
    fieldType: 'checkbox',
    isEnabled: true
  },
  {
    id: 'vitals_4',
    key: 'weight_required',
    label: 'Weight Required',
    value: 'true',
    description: 'Whether weight is required',
    screen: 'vitals',
    fieldType: 'checkbox',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'vitals_5',
    key: 'height_label',
    label: 'Height Label',
    value: 'Height (cm)',
    description: 'Label for height field',
    screen: 'vitals',
    fieldType: 'text'
  },
  {
    id: 'vitals_6',
    key: 'height_enabled',
    label: 'Height Field Enabled',
    value: 'true',
    description: 'Whether height field is enabled',
    screen: 'vitals',
    fieldType: 'checkbox',
    isEnabled: true
  },
  {
    id: 'vitals_7',
    key: 'height_required',
    label: 'Height Required',
    value: 'true',
    description: 'Whether height is required',
    screen: 'vitals',
    fieldType: 'checkbox',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'vitals_8',
    key: 'bp_systolic_label',
    label: 'Blood Pressure Systolic Label',
    value: 'BP Systolic (mmHg)',
    description: 'Label for systolic blood pressure field',
    screen: 'vitals',
    fieldType: 'text'
  },
  {
    id: 'vitals_9',
    key: 'bp_systolic_enabled',
    label: 'BP Systolic Field Enabled',
    value: 'true',
    description: 'Whether BP systolic field is enabled',
    screen: 'vitals',
    fieldType: 'checkbox',
    isEnabled: true
  },
  {
    id: 'vitals_10',
    key: 'bp_systolic_required',
    label: 'BP Systolic Required',
    value: 'false',
    description: 'Whether BP systolic is required',
    screen: 'vitals',
    fieldType: 'checkbox',
    isRequired: false,
    isEnabled: true
  },
  {
    id: 'vitals_11',
    key: 'bp_diastolic_label',
    label: 'Blood Pressure Diastolic Label',
    value: 'BP Diastolic (mmHg)',
    description: 'Label for diastolic blood pressure field',
    screen: 'vitals',
    fieldType: 'text'
  },
  {
    id: 'vitals_12',
    key: 'bp_diastolic_enabled',
    label: 'BP Diastolic Field Enabled',
    value: 'true',
    description: 'Whether BP diastolic field is enabled',
    screen: 'vitals',
    fieldType: 'checkbox',
    isEnabled: true
  },
  {
    id: 'vitals_13',
    key: 'bp_diastolic_required',
    label: 'BP Diastolic Required',
    value: 'false',
    description: 'Whether BP diastolic is required',
    screen: 'vitals',
    fieldType: 'checkbox',
    isRequired: false,
    isEnabled: true
  },
  {
    id: 'vitals_14',
    key: 'heart_rate_label',
    label: 'Heart Rate Label',
    value: 'Heart Rate (bpm)',
    description: 'Label for heart rate field',
    screen: 'vitals',
    fieldType: 'text'
  },
  {
    id: 'vitals_15',
    key: 'heart_rate_enabled',
    label: 'Heart Rate Field Enabled',
    value: 'true',
    description: 'Whether heart rate field is enabled',
    screen: 'vitals',
    fieldType: 'checkbox',
    isEnabled: true
  },
  {
    id: 'vitals_16',
    key: 'heart_rate_required',
    label: 'Heart Rate Required',
    value: 'false',
    description: 'Whether heart rate is required',
    screen: 'vitals',
    fieldType: 'checkbox',
    isRequired: false,
    isEnabled: true
  },
  {
    id: 'vitals_17',
    key: 'temperature_label',
    label: 'Temperature Label',
    value: 'Temperature (°C)',
    description: 'Label for temperature field',
    screen: 'vitals',
    fieldType: 'text'
  },
  {
    id: 'vitals_18',
    key: 'temperature_enabled',
    label: 'Temperature Field Enabled',
    value: 'true',
    description: 'Whether temperature field is enabled',
    screen: 'vitals',
    fieldType: 'checkbox',
    isEnabled: true
  },
  {
    id: 'vitals_19',
    key: 'temperature_required',
    label: 'Temperature Required',
    value: 'false',
    description: 'Whether temperature is required',
    screen: 'vitals',
    fieldType: 'checkbox',
    isRequired: false,
    isEnabled: true
  },

  // Appointment Booking Screen Fields
  {
    id: 'booking_1',
    key: 'page_title',
    label: 'Page Title',
    value: 'Book Appointment',
    description: 'Main page title for appointment booking',
    screen: 'booking',
    fieldType: 'text'
  },
  {
    id: 'booking_2',
    key: 'mr_number_label',
    label: 'MR Number Label',
    value: 'MR Number',
    description: 'Label for MR number field',
    screen: 'booking',
    fieldType: 'text'
  },
  {
    id: 'booking_3',
    key: 'doctor_label',
    label: 'Doctor Label',
    value: 'Select Doctor',
    description: 'Label for doctor selection',
    screen: 'booking',
    fieldType: 'text'
  },
  {
    id: 'booking_4',
    key: 'appointment_date_label',
    label: 'Appointment Date Label',
    value: 'Appointment Date',
    description: 'Label for appointment date field',
    screen: 'booking',
    fieldType: 'text'
  },
  {
    id: 'booking_5',
    key: 'appointment_time_label',
    label: 'Appointment Time Label',
    value: 'Appointment Time',
    description: 'Label for appointment time field',
    screen: 'booking',
    fieldType: 'text'
  },
  {
    id: 'booking_6',
    key: 'notes_label',
    label: 'Notes Label',
    value: 'Additional Notes',
    description: 'Label for notes field',
    screen: 'booking',
    fieldType: 'text'
  }
];

// Keep the legacy export for backward compatibility
export const dashboardScreenFields = allScreenFields.filter(field => field.screen === 'dashboard');
