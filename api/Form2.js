import React, { useState } from "react";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Form2.css';

export default function Form2({ onSubmit, onReset }) {
  const [formValue, setFormValue] = useState({
    server: "",
    table1: "",
    table2: "",
    onCondition: "",
    onConditionT2: "",
    columnT1: "",
    columnT2: "",
    conditionsT1: [{ type: "", value: "" }],
    conditionsT2: [{ type: "", value: "" }]
  });

  const [errors, setErrors] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formValue.server) {
      newErrors.server = "Server is required";
    }
    if (!formValue.table1) {
      newErrors.table1 = "Table 1 is required";
    }
    if (!formValue.table2) {
      newErrors.table2 = "Table 2 is required";
    }
    if (!formValue.onCondition) {
      newErrors.onCondition = "On Condition is required";
    }
    if (!formValue.columnT1) {
      newErrors.columnT1 = "Column t1 is required";
    }
    if (!formValue.columnT2) {
      newErrors.columnT2 = "Column t2 is required";
    }
    // At least one condition
    const hasValidCondition = formValue.conditions.some(cond => cond.type && cond.value);
    if (!hasValidCondition) {
      newErrors.conditions = "At least one condition must be specified";
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

  // Handlers for T1
  const handleConditionT1Change = (index, field, value) => {
    setIsFormChanged(true);
    const newConditions = [...formValue.conditionsT1];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value
    };
    setFormValue({
      ...formValue,
      conditionsT1: newConditions
    });
  };
  const addConditionT1Group = () => {
    setIsFormChanged(true);
    setFormValue({
      ...formValue,
      conditionsT1: [...formValue.conditionsT1, { type: "", value: "" }]
    });
  };
  const removeConditionT1Group = (index) => {
    setIsFormChanged(true);
    const newConditions = formValue.conditionsT1.filter((_, i) => i !== index);
    setFormValue({
      ...formValue,
      conditionsT1: newConditions.length ? newConditions : [{ type: "", value: "" }]
    });
  };
  // Handlers for T2
  const handleConditionT2Change = (index, field, value) => {
    setIsFormChanged(true);
    const newConditions = [...formValue.conditionsT2];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value
    };
    setFormValue({
      ...formValue,
      conditionsT2: newConditions
    });
  };
  const addConditionT2Group = () => {
    setIsFormChanged(true);
    setFormValue({
      ...formValue,
      conditionsT2: [...formValue.conditionsT2, { type: "", value: "" }]
    });
  };
  const removeConditionT2Group = (index) => {
    setIsFormChanged(true);
    const newConditions = formValue.conditionsT2.filter((_, i) => i !== index);
    setFormValue({
      ...formValue,
      conditionsT2: newConditions.length ? newConditions : [{ type: "", value: "" }]
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
      server: "",
      table1: "",
      table2: "",
      onCondition: "",
      onConditionT2: "",
      columnT1: "",
      columnT2: "",
      conditionsT1: [{ type: "", value: "" }],
      conditionsT2: [{ type: "", value: "" }]
    });
    setIsFormChanged(false);
    setErrors({});
    onReset && onReset();
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
    { value: 'locations', label: 'Location' },
    { value: 'form_via_form_main_forms', label: 'Checksheet' },
    { value: 'plc_floattable_79', label: 'PLC Float Table' }
  ];

  const onConditionOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' }
  ];

  const columnOptions = [
    { value: 'module_id', label: 'Module ID' },
    { value: 'module_name', label: 'ModuleName' },
    { value: 'id', label: 'ID' },
    { value: 'tag16', label: 'Model' },
    { value: 'tag17', label: 'Code' },
    { value: 'fvf_main_form_name', label: 'Form Name' }
  ];

  const conditionTypeOptions = [
    { value: 'company_id', label: 'Company ID' },
    { value: 'module_id', label: 'Module ID' },
    { value: 'tag16', label: 'Tag16' },
    { value: 'workflow_approve_status', label: 'Workflow Approved Status' },
    { value: 'deleted_at', label: 'Deleted' },
  ];

  return (
    <div className="form-container bg-white">
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">Server</label>
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
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">Table 1</label>
              <Select
                name="table1"
                value={tableOptions.find(option => option.value === formValue.table1) || null}
                onChange={handleChange}
                options={tableOptions}
                styles={customStyles}
                placeholder="Select Table 1"
                isSearchable
                isClearable
                required
              />
              {errors.table1 && <div className="text-danger small mt-1">{errors.table1}</div>}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">Table 2</label>
              <Select
                name="table2"
                value={tableOptions.find(option => option.value === formValue.table2) || null}
                onChange={handleChange}
                options={tableOptions}
                styles={customStyles}
                placeholder="Select Table 2"
                isSearchable
                isClearable
                required
              />
              {errors.table2 && <div className="text-danger small mt-1">{errors.table2}</div>}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">On Condition T1</label>
              <Select
                name="onCondition"
                value={onConditionOptions.find(option => option.value === formValue.onCondition) || null}
                onChange={handleChange}
                options={onConditionOptions}
                styles={customStyles}
                placeholder="Select On Condition T1"
                isSearchable
                isClearable
                required
              />
              {errors.onCondition && <div className="text-danger small mt-1">{errors.onCondition}</div>}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">On Condition T2</label>
              <Select
                name="onConditionT2"
                value={onConditionOptions.find(option => option.value === formValue.onConditionT2) || null}
                onChange={handleChange}
                options={onConditionOptions}
                styles={customStyles}
                placeholder="Select On Condition T2"
                isSearchable
                isClearable
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">Column t1</label>
              <Select
                name="columnT1"
                value={columnOptions.find(option => option.value === formValue.columnT1) || null}
                onChange={handleChange}
                options={columnOptions}
                styles={customStyles}
                placeholder="Select Column t1"
                isSearchable
                isClearable
                required
              />
              {errors.columnT1 && <div className="text-danger small mt-1">{errors.columnT1}</div>}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label className="form-label">Column t2</label>
              <Select
                name="columnT2"
                value={columnOptions.find(option => option.value === formValue.columnT2) || null}
                onChange={handleChange}
                options={columnOptions}
                styles={customStyles}
                placeholder="Select Column t2"
                isSearchable
                isClearable
                required
              />
              {errors.columnT2 && <div className="text-danger small mt-1">{errors.columnT2}</div>}
            </div>
          </div>
        </div>
        {/* ConditionT1 Groups */}
        <div className="row">
          <div className="col-12">
            <label className="form-label">Condition T1</label>
            {formValue.conditionsT1.map((cond, index) => (
              <div key={index} className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <Select
                    name={`conditionT1Type-${index}`}
                    value={conditionTypeOptions.find(option => option.value === cond.type) || null}
                    onChange={(selectedOption) => handleConditionT1Change(index, 'type', selectedOption?.value)}
                    options={conditionTypeOptions}
                    styles={customStyles}
                    placeholder="Select Condition T1 Type"
                    isSearchable
                    isClearable
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={cond.value}
                    onChange={(e) => handleConditionT1Change(index, 'value', e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
                <div className="col-md-4">
                  {index === formValue.conditionsT1.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={addConditionT1Group}
                    >
                      +
                    </button>
                  )}
                  {formValue.conditionsT1.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeConditionT1Group(index)}
                    >
                      -
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ConditionT2 Groups */}
        <div className="row">
          <div className="col-12">
            <label className="form-label">Condition T2</label>
            {formValue.conditionsT2.map((cond, index) => (
              <div key={index} className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <Select
                    name={`conditionT2Type-${index}`}
                    value={conditionTypeOptions.find(option => option.value === cond.type) || null}
                    onChange={(selectedOption) => handleConditionT2Change(index, 'type', selectedOption?.value)}
                    options={conditionTypeOptions}
                    styles={customStyles}
                    placeholder="Select Condition T2 Type"
                    isSearchable
                    isClearable
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={cond.value}
                    onChange={(e) => handleConditionT2Change(index, 'value', e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
                <div className="col-md-4">
                  {index === formValue.conditionsT2.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={addConditionT2Group}
                    >
                      +
                    </button>
                  )}
                  {formValue.conditionsT2.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeConditionT2Group(index)}
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
          <div className="col-md-6">
            <div className="form-group">
              <button className="btn btn-primary px-4" type="submit">
                Submit
              </button>
            </div>
          </div>
          <div className="col-md-6">
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
