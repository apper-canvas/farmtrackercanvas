import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import MetricCard from "@/components/molecules/MetricCard";
import StatusBadge from "@/components/molecules/StatusBadge";
import TransactionModal from "@/components/organisms/TransactionModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import expenseTransactionService from "@/services/api/expenseTransactionService";
import incomeTransactionService from "@/services/api/incomeTransactionService";
import { toast } from "react-toastify";

const Financial = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("expense");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [expenses, income, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [expensesData, incomeData] = await Promise.all([
        expenseTransactionService.getAll(),
        incomeTransactionService.getAll()
      ]);
      setExpenses(expensesData);
      setIncome(incomeData);
    } catch (err) {
      setError("Failed to load financial data");
      console.error("Financial data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    const filterBySearchTerm = (transactions) => {
      if (!searchTerm.trim()) return transactions;
      return transactions.filter(transaction =>
        transaction.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    setFilteredExpenses(filterBySearchTerm(expenses));
    setFilteredIncome(filterBySearchTerm(income));
  };

  const calculateTotals = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const totalIncome = income.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
    const netIncome = totalIncome - totalExpenses;

    return { totalExpenses, totalIncome, netIncome };
  };

  const handleAddTransaction = (type) => {
    setModalType(type);
    setSelectedTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction, type) => {
    setModalType(type);
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setModalLoading(true);
      
      if (selectedTransaction) {
        // Update existing transaction
        if (modalType === "expense") {
          await expenseTransactionService.update(selectedTransaction.Id, formData);
          toast.success("Expense updated successfully!");
        } else {
          await incomeTransactionService.update(selectedTransaction.Id, formData);
          toast.success("Income updated successfully!");
        }
      } else {
        // Create new transaction
        if (modalType === "expense") {
          await expenseTransactionService.create(formData);
          toast.success("Expense added successfully!");
        } else {
          await incomeTransactionService.create(formData);
          toast.success("Income added successfully!");
        }
      }
      
      setShowModal(false);
      await loadData();
    } catch (error) {
      toast.error(`Failed to ${selectedTransaction ? 'update' : 'add'} ${modalType}`);
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTransaction = async (transaction, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      if (type === "expense") {
        await expenseTransactionService.delete(transaction.Id);
        toast.success("Expense deleted successfully!");
      } else {
        await incomeTransactionService.delete(transaction.Id);
        toast.success("Income deleted successfully!");
      }
      await loadData();
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount) || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const { totalExpenses, totalIncome, netIncome } = calculateTotals();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const tabs = [
    { id: "overview", label: "Overview", icon: "PieChart" },
    { id: "expenses", label: "Expenses", icon: "Receipt" },
    { id: "income", label: "Income", icon: "Banknote" }
  ];

  const TransactionItem = ({ transaction, type, onEdit, onDelete }) => (
    <Card className="mb-3" hover>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon 
                name={type === "expense" ? "Receipt" : "Banknote"} 
                className={`w-5 h-5 ${type === "expense" ? "text-red-600" : "text-green-600"}`}
              />
              <h4 className="font-semibold text-gray-900">{transaction.name}</h4>
              <span className={`font-bold ${type === "expense" ? "text-red-600" : "text-green-600"}`}>
                {type === "expense" ? "-" : "+"}{formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center space-x-4">
                <span>{formatDate(transaction.date)}</span>
                {type === "expense" ? (
                  <StatusBadge 
                    status={transaction.category?.toLowerCase()} 
                    text={transaction.category} 
                  />
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {transaction.source}
                  </span>
                )}
                <span className="text-gray-500">{transaction.fieldName}</span>
              </div>
              {transaction.description && (
                <p className="text-gray-500 text-xs mt-1">{transaction.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(transaction, type)}
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(transaction, type)}
              className="text-red-600 hover:text-red-800"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Financial Management</h1>
          <p className="text-gray-600 mt-1">Track farm expenses and income</p>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon="TrendingUp"
          color="fresh"
        />
        <MetricCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon="TrendingDown"
          color="red"
        />
        <MetricCard
          title="Net Income"
          value={formatCurrency(netIncome)}
          icon={netIncome >= 0 ? "DollarSign" : "AlertTriangle"}
          color={netIncome >= 0 ? "forest" : "red"}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-forest text-forest'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Expenses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Expenses</h3>
                <Button
                  size="sm"
                  onClick={() => handleAddTransaction("expense")}
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                  Add Expense
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <TransactionItem
                    key={expense.Id}
                    transaction={expense}
                    type="expense"
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                ))}
                {expenses.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No expenses recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Income */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Income</h3>
                <Button
                  size="sm"
                  onClick={() => handleAddTransaction("income")}
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                  Add Income
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {income.slice(0, 5).map((incomeItem) => (
                  <TransactionItem
                    key={incomeItem.Id}
                    transaction={incomeItem}
                    type="income"
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                ))}
                {income.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No income recorded</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search expenses..."
              immediate={true}
            />
            <Button onClick={() => handleAddTransaction("expense")}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>

          {filteredExpenses.length === 0 ? (
            <Empty
              type="expenses"
              message="No expenses found"
              onAction={() => handleAddTransaction("expense")}
            />
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <TransactionItem
                  key={expense.Id}
                  transaction={expense}
                  type="expense"
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "income" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search income..."
              immediate={true}
            />
            <Button onClick={() => handleAddTransaction("income")}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Income
            </Button>
          </div>

          {filteredIncome.length === 0 ? (
            <Empty
              type="income"
              message="No income found"
              onAction={() => handleAddTransaction("income")}
            />
          ) : (
            <div className="space-y-3">
              {filteredIncome.map((incomeItem) => (
                <TransactionItem
                  key={incomeItem.Id}
                  transaction={incomeItem}
                  type="income"
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        transaction={selectedTransaction}
        type={modalType}
        loading={modalLoading}
      />
    </div>
  );
};

export default Financial;