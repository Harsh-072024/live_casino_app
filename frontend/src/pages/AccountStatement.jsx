import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const AccountStatement = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Helper: Map filter
  const mapFilterToQuery = (filter) => {
    switch (filter) {
      case "deposit":
        return "admin-credit";
      case "withdrawal":
        return "admin-debit";
      case "bet":
      case "win":
        return filter;
      case "all":
      default:
        return ""; // No filter
    }
  };
  
  // ✅ Helper: Map transaction labels
  const mapType = (type) => {
    switch (type) {
      case "admin-credit":
        return "Deposit";
      case "admin-debit":
        return "Withdrawal";
      case "bet":
        return "Bet";
      case "win":
        return "Win";
      default:
        return type;
    }
  };
  
  const fetchTransactions = async (filter, pageNumber) => {
    setLoading(true);
    setError("");
    try {
      const actualType = mapFilterToQuery(filter);
      const url = actualType
        ? `/transactions/my/type?type=${actualType}&page=${pageNumber}&limit=10`
        : `/transactions/my/type?page=${pageNumber}&limit=20`;

      const response = await axiosInstance.get(url, { withCredentials: true });
      const data = response.data.data;

      setTransactions(data?.transactions || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading transactions.");
      setTransactions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTransactions(selectedType, page);
  }, [selectedType, page]);
  
  return (
    <div className="max-w-3xl mx-auto p-4 mt-20 rounded-lg bg-white shadow">
      <h1 className="text-2xl font-bold text-gray-800">Account Statement</h1>
      <p className="text-gray-600 mt-1">Review your transaction history below.</p>

      {/* ✅ Filter Dropdown */}
      <div className="mt-4">
        <label className="block text-gray-700 font-semibold">Filter by Type:</label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setPage(1);
          }}
          className="mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="bet">Bet</option>
          <option value="win">Win</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
      </div>

      {loading && <div className="mt-4 text-gray-600">Loading transactions...</div>}
      {error && <div className="mt-4 text-red-500 font-bold">{error}</div>}

      {!loading && !error && transactions.length === 0 && (
        <div className="mt-4 text-gray-600">No transactions found for this filter.</div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <>
          <div className="overflow-x-auto mt-4 rounded border border-gray-300">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} className="border-t">
                    <td className="p-3">{new Date(txn.createdAt).toLocaleString()}</td>
                    <td className="p-3">₹{txn.amount}</td>
                    <td className="p-3">{mapType(txn.type)}</td>
                    <td className="p-3">{txn.reason}</td>
                    <td className="p-3">₹{txn.balanceAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          <div className="mt-4 flex justify-center space-x-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-1 rounded ${page <= 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              Prev
            </button>
            <span className="font-bold">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-3 py-1 rounded ${page >= totalPages ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountStatement;
