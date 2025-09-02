import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import fieldService from "@/services/api/fieldService";

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  transaction = null, 
  type = "expense", // "expense" or "income"
  loading = false 
}) => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Other', // For expenses
    source: '', // For income
    description: '',
    fieldId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadFields();
      if (transaction) {
        setFormData({
          name: transaction.name || '',
          date: transaction.date || new Date().toISOString().split('T')[0],
          amount: transaction.amount?.toString() || '',
          category: transaction.category || 'Other',
          source: transaction.source || '',
          description: transaction.description || '',
          fieldId: transaction.fieldId?.toString() || ''
        });
      } else {
        setFormData({
          name: '',
          date: new Date().toISOString().split('T')[0],
          amount: '',
          category: 'Other',
          source: '',
          description: '',
          fieldId: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, transaction]);

  const loadFields = async () => {
    try {
      const fieldsData = await fieldService.getAll();
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading fields:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (type === "expense" && !formData.category) {
      newErrors.category = 'Category is required';
    }

    if (type === "income" && !formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(`Error ${transaction ? 'updating' : 'creating'} ${type}:`, error);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  const categoryOptions = [
    { value: 'Food', label: 'Food' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Rent', label: 'Rent' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon 
                name={type === "expense" ? "Receipt" : "Banknote"} 
                className="w-5 h-5 text-forest" 
              />
              <h3 className="text-lg font-semibold">
                {transaction ? 'Edit' : 'Add'} {type === "expense" ? 'Expense' : 'Income'}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                type="input"
                label="Name"
                placeholder={`Enter ${type} name`}
                value={formData.name}
                onChange={handleChange('name')}
                error={errors.name}
                required
              />

              <FormField
                type="input"
                inputType="date"
                label="Date"
                value={formData.date}
                onChange={handleChange('date')}
                error={errors.date}
                required
              />

              <FormField
                type="input"
                inputType="number"
                label="Amount ($)"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange('amount')}
                error={errors.amount}
                required
              />

              {type === "expense" ? (
                <FormField
                  type="select"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange('category')}
                  error={errors.category}
                  options={categoryOptions}
                  required
                />
              ) : (
                <FormField
                  type="input"
                  label="Source"
                  placeholder="Enter income source"
                  value={formData.source}
                  onChange={handleChange('source')}
                  error={errors.source}
                  required
                />
              )}

              <FormField
                type="select"
                label="Field (Optional)"
                value={formData.fieldId}
                onChange={handleChange('fieldId')}
                error={errors.fieldId}
                options={[
                  { value: '', label: 'All Fields' },
                  ...fields.map(field => ({
                    value: field.Id.toString(),
                    label: field.name
                  }))
                ]}
              />

              <FormField
                type="textarea"
                label="Description (Optional)"
                placeholder={`Enter ${type} description`}
                rows={3}
                value={formData.description}
                onChange={handleChange('description')}
                error={errors.description}
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                  disabled={loading}
                >
                  {transaction ? 'Update' : 'Add'} {type === "expense" ? 'Expense' : 'Income'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionModal;