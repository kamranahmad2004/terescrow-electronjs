import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionDetailsModal from "../modal/TransactionDetailsModal";

export interface Transaction {
  id: number;
  name: string;
  username: string;
  status: string;
  serviceType: string;
  transactionType: string;
  date: string;
  amount: string;
}

interface TransactionsTableProps {
  data: Transaction[];
  showCustomerDetailsButton?: boolean;
  onRowClick?: (transaction: Transaction) => void; // Custom row click behavior
  showTransactionDetailsModal?: boolean; // Show transaction modal
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  data,
  showCustomerDetailsButton = true,
  onRowClick,
  showTransactionDetailsModal = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const handleRowClick = (transaction: Transaction) => {
    if (onRowClick) {
      onRowClick(transaction);
    } else if (showTransactionDetailsModal) {
      setSelectedTransaction(transaction);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleViewCustomerDetails = (customerId: number) => {
    navigate(`/customers/${customerId}`);
  };
  const toggleMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md">
      <table className="min-w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="py-3 px-4">Name, Username</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Service Type</th>
            <th className="py-3 px-4">Transaction Type</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Amount</th>
            {showCustomerDetailsButton && <th className="py-3 px-1"></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-t hover:bg-gray-50 cursor-pointer relative"
              onClick={() => handleRowClick(transaction)}

            >
              <td className="py-3 px-4">
                <div>
                  <span className="font-semibold">{transaction.name}</span>
                  <span className="text-sm text-gray-500"> ({transaction.username})</span>
                </div>
              </td>
              <td className="w-[23px] py-3 px-4">
                <span
                  className={`px-2 py-1 flex items-center gap-2 text-sm font-medium rounded-lg border ${transaction.status === "Successful"
                      ? "bg-green-100 text-green-700 border-green-500"
                      : "bg-red-100 text-red-700 border-red-500"
                    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${transaction.status === "Successful" ? "bg-green-700" : "bg-red-700"
                      }`}
                  ></span>
                  {transaction.status}
                </span>

              </td>
              <td className="font-semibold py-3 px-4">{transaction.serviceType}</td>
              <td className="font-semibold py-3 px-4">{transaction.transactionType}</td>
              <td className="font-semibold py-3 px-4">{transaction.date}</td>
              <td className="font-semibold py-3 px-4">{transaction.amount}</td>
              {showCustomerDetailsButton && (
                <td className="py-3 px-4 text-right ">
                  <button
                    onClick={() => toggleMenu(transaction.id)}
                    className="text-black hover:text-gray-700 focus:outline-none"
                  >
                    &#x22EE; {/* Vertical ellipsis */}
                  </button>
                  {activeMenu === transaction.id && (
                    <div
                      className="absolute right-0 mt-2 bg-[#F6F7FF] rounded-md w-48 z-50"
                      style={{
                        boxShadow: '0px 4px 6px #00000040', // Custom drop shadow
                      }}
                    >
                      <button
                        onClick={() => handleViewCustomerDetails(1)}

                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        View Customer Details
                      </button>
                      <button
                        onClick={() => console.log('View Transaction Details')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        View Transaction Details
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Transaction Details Modal */}
      {showTransactionDetailsModal && isModalOpen && selectedTransaction && (
        <TransactionDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          transactionData={{
            dollarAmount: "$250,000",
            nairaAmount: "NGN425,000,000",
            serviceType: "Gift Card Purchase",
            giftCardType: "Amazon Gift Card",
            giftCardSubType: "-",
            quantity: 2,
            code: "034ahds49djskd",
            transactionId: "238Dsjfjf3djcmdnsd",
            assignedAgent: "Qamardeen Abdulmalik",
            status: "Successful",
          }}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
