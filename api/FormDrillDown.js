import React, { useState, useEffect } from "react";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FormDrillDown.css';

export default function FormDrillDown({ onSubmit, onReset, initialData }) {
  const [formValue, setFormValue] = useState({
    useCase: initialData?.useCase || "",
    server: initialData?.server || "",
    table: initialData?.table || "",
    columns: initialData?.columns || [],
    matchColumns: initialData?.matchColumns || [],
    filters: initialData?.filters || [{ type: "", value: "" }]
  });

  const [errors, setErrors] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormValue({
        useCase: initialData.useCase || "",
        server: initialData.server || "",
        table: initialData.table || "",
        columns: initialData.columns || [],
        matchColumns: initialData.matchColumns || [],
        filters: initialData.filters || [{ type: "", value: "" }]
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formValue.server) {
      newErrors.server = "Server is required";
    }
    if (!formValue.table) {
      newErrors.table = "Table is required";
    }
    if (!formValue.columns.length) {
      newErrors.columns = "At least one column must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFormForSave = () => {
    const newErrors = {};
    
    if (!formValue.useCase) {
      newErrors.useCase = "Use case name is required for saving";
    }
    if (!formValue.server) {
      newErrors.server = "Server is required";
    }
    if (!formValue.table) {
      newErrors.table = "Table is required";
    }
    if (!formValue.columns.length) {
      newErrors.columns = "At least one column must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (selectedOption, { name }) => {
    setIsFormChanged(true);
    setFormValue({
      ...formValue,
      [name]: selectedOption ? selectedOption.value : ""
    });
  };

  const handleMultiChange = (selectedOptions, { name }) => {
    setIsFormChanged(true);
    setFormValue({
      ...formValue,
      [name]: selectedOptions ? selectedOptions.map(option => option.value) : []
    });
  };

  const handleFilterChange = (index, field, value) => {
    setIsFormChanged(true);
    const newFilters = [...formValue.filters];
    newFilters[index] = {
      ...newFilters[index],
      [field]: value
    };
    setFormValue({
      ...formValue,
      filters: newFilters
    });
  };

  const removeFilterGroup = (index) => {
    setIsFormChanged(true);
    const newFilters = formValue.filters.filter((_, i) => i !== index);
    setFormValue({
      ...formValue,
      filters: newFilters.length ? newFilters : [{ type: "", value: "" }]
    });
  };

  const addFilterGroup = () => {
    setIsFormChanged(true);
    setFormValue({
      ...formValue,
      filters: [...formValue.filters, { type: "", value: "" }]
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (!isFormChanged) {
      alert("No changes have been made to the form. Please make changes before submitting.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    onSubmit(formValue);
    setIsFormChanged(false);
  };

  const resetForm = () => {
    setFormValue({
      useCase: "",
      server: "",
      table: "",
      columns: [],
      matchColumns: [],
      filters: [{ type: "", value: "" }]
    });
    setIsFormChanged(false);
    setErrors({});
    onReset && onReset();
  };

  const handleSave = async () => {
    if (!validateFormForSave()) {
      return;
    }

    try {
      console.log('Attempting to save form data:', formValue);
      
      const response = await fetch('http://localhost:3001/api/save-drilldown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          useCase: formValue.useCase,
          server: formValue.server,
          table: formValue.table,
          columns: formValue.columns,
          filters: formValue.filters.filter(f => f.type && f.value)
        })
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        setSaveStatus(`Saved successfully! (ID: ${data.submissionId})`);
        setTimeout(() => setSaveStatus(""), 3000);
        // Reset form after successful save
        resetForm();
      } else {
        setSaveStatus(`Failed to save: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving submission:', error);
      setSaveStatus(`Error saving data: ${error.message}`);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '32px',
      height: '32px',
      fontSize: '0.875rem'
    }),
    option: (base) => ({
      ...base,
      fontSize: '0.875rem',
      padding: '8px 12px'
    }),
    menu: (base) => ({
      ...base,
      fontSize: '0.875rem'
    }),
    multiValue: (base) => ({
      ...base,
      fontSize: '0.875rem'
    })
  };

  const serverOptions = [
    { value: 'staging', label: 'Staging' },
    { value: 'workspace', label: 'Production' },
    { value: 'devn', label: 'Devn' },
    { value: 'heromotocop', label: 'Hero Production Server' },
    { value: 'iljin', label: 'Iljin' },
    { value: 'amber', label: 'Amber' },
    { value: 'dabur', label: 'Dabur' },
    { value: 'itc', label: 'ITC' },
    { value: 'hul_nesa', label: 'Hul Nesa' },
    { value: 'ppap', label: 'PPAP' },
    { value: 'sunplast', label: 'Sunplast' },
    { value: 'skh', label: 'SKH' },
    { value: 'mondelez', label: 'Mondelez' },
    { value: 'danone', label: 'Danone' },
    { value: 'raipur', label: 'Raipur' }
  ];

  const tableOptions = [
    { value: 'modules', label: 'Module' },
    { value: 'users', label: 'User' },
    { value: 'locations', label: 'Machines(Locations)' },
    { value: 'form_via_form_main_forms', label: 'Checksheet' },
    { value: 'form_via_form_main_audits', label: 'Submission' }, 
    { value: 'form_via_form_main_audit_answers', label: 'Submissions Details' },
    { value: 'departments', label: 'Module Group (Area)' },
    { value: 'plants', label: 'Plants' },  
  ];

  const columnOptions = [
    //Module
    { value: 'module_id', label: 'Module ID' },
    { value: 'module_name', label: 'ModuleName' },

    //Checksheet
    { value: 'fvf_main_form_id', label: 'Form ID' },
    { value: 'fvf_main_form_name', label: 'Form Name' },

    //Submissions Details
    { value: 'fvf_main_ans_id', label: 'Submission Detail ID' },
    { value: 'fvf_main_field_option_id', label: 'Field Option ID' },
    { value: 'answer', label: 'Answer' },

    //Plants
    { value: 'plant_id', label: 'Plant ID' },
    { value: 'plant_name', label: 'Plant Name' },
    
    //Departments
    { value: 'department_id', label: 'Department ID' },
    { value: 'department_name', label: 'Department Name' },

    //Machines
    { value: 'location_id', label: 'Machine ID' },
    { value: 'location_name', label: 'Machine Name' },
    // { value: 'department_id', label: 'Department Id' },

    //Users
    { value: 'user_id', label: 'User ID' },
    { value: 'firstname', label: 'First Name' },
    { value: 'email', label: 'Email' },
  ];

  const filterTypeOptions = [
    //Company
    { value: 'company_id', label: 'Company ID' },
    //Module
    { value: 'module_id', label: 'Module ID' },
    //Checksheet
    { value: 'form_via_form_main_field_options', label: 'Options ID' },
    //Workflow
    { value: 'fvf_main_form_id', label: 'Form ID' },
    { value: 'workflow_approve_status', label: 'Workflow Approved Status' },
    { value: 'fvf_main_form_status', label: 'Form Status' },
    //Deleted
    { value: 'deleted_at', label: 'Deleted' },
    { value: 'created_at', label: 'Created' },
    //Answers
    { value: 'fvf_main_audit_id', label: 'Submission ID' },
    // { value: 'fvf_main_form_id', label: 'Form ID' },
    { value: 'fvf_section_id', label: 'Section ID' },
    { value: 'fvf_main_field_id', label: 'Field ID' },
    { value: 'fvf_main_field_type', label: 'Field Type' },
    
    //Plants
    { value: 'plant_id', label: 'Plant ID' },
    { value: 'site_id', label: 'Site ID' },
    { value: 'user_id', label: 'User ID' },

    //Department(Area)
    //{ value: 'plant_id', label: 'Plant ID' },
    { value: 'user_id', label: 'User ID' },
    { value: 'department_id', label: 'Department ID' },

    //Location(Machine)
    //{ value: 'department_id', label: 'Department ID' },
    { value: 'company_id', label: 'Company ID' },
    { value: 'location_id', label: 'Location ID' },
  ];

  const tableColumnMap = {
    modules: ['module_id', 'module_name'],
    users: ['user_id', 'firstname', 'email'],
    locations: ['location_id', 'location_name','department_id'],
    form_via_form_main_forms: ['fvf_main_form_id', 'fvf_main_form_name', ],
    form_via_form_main_audits: ['fvf_main_form_id', 'department_name'],
    form_via_form_main_audit_answers: ['fvf_main_ans_id', 'fvf_main_field_option_id', 'answer', 'fvf_main_form_id'],
    departments: ['department_id','department_name'],
    plants: ['plant_id', 'plant_name'],
  };

  const filteredColumnOptions = formValue.table
    ? columnOptions.filter(opt => (tableColumnMap[formValue.table] || []).includes(opt.value))
    : [];

  const tableFilterMap = {
    modules: ['module_id'],
    users: ['user_id', 'firstname', 'email'],
    locations: ['location_id', 'location_name'],
    form_via_form_main_forms: ['fvf_main_form_name', 'fvf_main_form_id', 'workflow_approve_status', 'fvf_main_form_status', 'module_id'],
    form_via_form_main_audits: ['department_id', 'department_name'],
    departments: ['department_id', 'department_name'],
    plants: ['plant_id', 'site_id'],
    form_via_form_main_audit_answers: ['fvf_main_audit_id', 'fvf_main_form_id', 'fvf_section_id', 'fvf_main_field_id','fvf_main_field_type','user_id'],
  };

  const filteredFilterTypeOptions = formValue.table
    ? filterTypeOptions.filter(opt => (tableFilterMap[formValue.table] || []).includes(opt.value))
    : [];

  return (
    <div className="form-container bg-white">
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="row">
          <div className="col-12">
            <div className="form-group mb-3">
              <label htmlFor="useCase" className="form-label">Use Case</label>
              <input
                type="text"
                className="form-control"
                id="useCase"
                value={formValue.useCase}
                onChange={(e) => {
                  setIsFormChanged(true);
                  setFormValue({
                    ...formValue,
                    useCase: e.target.value
                  });
                }}
                placeholder="Enter use case name"
                required
              />
              {errors.useCase && <div className="text-danger small mt-1">{errors.useCase}</div>}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="validationDefault01" className="form-label">Server</label>
              <Select
                name="server"
                value={serverOptions.find(option => option.value === formValue.server) || null}
                onChange={handleChange}
                options={serverOptions}
                styles={customStyles}
                placeholder="Select Server"
                isSearchable
                isClearable
                required
              />
              {errors.server && <div className="text-danger small mt-1">{errors.server}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="validationDefault02" className="form-label">List</label>
              <Select
                name="table"
                value={tableOptions.find(option => option.value === formValue.table) || null}
                onChange={handleChange}
                options={tableOptions}
                styles={customStyles}
                placeholder="Select Table"
                isSearchable
                isClearable
                required
              />
              {errors.table && <div className="text-danger small mt-1">{errors.table}</div>}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="validationDefault03" className="form-label">Columns</label>
              <Select
                name="columns"
                value={filteredColumnOptions.filter(option => formValue.columns.includes(option.value)) || []}
                onChange={(selectedOptions) => handleMultiChange(selectedOptions, { name: 'columns' })}
                options={filteredColumnOptions}
                styles={customStyles}
                placeholder="Select Columns"
                isMulti
                isSearchable
                isClearable
                required
              />
              {errors.columns && <div className="text-danger small mt-1">{errors.columns}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="validationDefault04" className="form-label">Match Columns</label>
              <Select
                name="matchColumns"
                value={filteredColumnOptions.filter(option => formValue.matchColumns.includes(option.value)) || []}
                onChange={(selectedOptions) => handleMultiChange(selectedOptions, { name: 'matchColumns' })}
                options={filteredColumnOptions}
                styles={customStyles}
                placeholder="Select Match Columns"
                isMulti
                isSearchable
                isClearable
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <label className="form-label">Filters</label>
            {errors.filters && <div className="text-danger small mb-2">{errors.filters}</div>}
            {formValue.filters.map((filter, index) => (
              <div key={index} className="row mb-3">
                <div className="col-md-5">
                  <Select
                    name={`filterType-${index}`}
                    value={filteredFilterTypeOptions.find(option => option.value === filter.type) || null}
                    onChange={(selectedOption) => handleFilterChange(index, 'type', selectedOption?.value)}
                    options={filteredFilterTypeOptions}
                    styles={customStyles}
                    placeholder="Select Filter Type"
                    isSearchable
                    isClearable
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={filter.value}
                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                    placeholder="Enter filter value"
                  />
                </div>
                <div className="col-md-2">
                  {index === formValue.filters.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addFilterGroup}
                    >
                      +
                    </button>
                  )}
                  {formValue.filters.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => removeFilterGroup(index)}
                    >
                      -
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="form-group">
              <button className="btn btn-primary px-4" type="submit">
                Submit
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group d-flex justify-content-center">
              <button 
                type="button" 
                className="btn btn-success px-4" 
                onClick={handleSave}
              >
                Save
              </button>
              {saveStatus && (
                <span className="ms-2 text-success">{saveStatus}</span>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary px-4" 
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
