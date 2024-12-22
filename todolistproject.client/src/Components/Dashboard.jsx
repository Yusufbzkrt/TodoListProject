import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function Dashboard() {
    const [activeTab, setActiveTab] = useState("daily");
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isAddingReport, setIsAddingReport] = useState(false);
    const [newReport, setNewReport] = useState({
        title: "",
        description: "",
        reportTypeId: 1, 
    });
    const [token, setToken] = useState(localStorage.getItem("token"));
    const apiClient = axios.create({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const fetchReportData = async (reportType) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`https://localhost:7120/api/reports/${reportType}`);
            setReportData(response.data); 
        } catch (error) {
            console.error("Veri çekme hatasý:", error);
        } finally {
            setLoading(false); 
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        fetchReportData(tab);
    };

    const handleAddReport = async () => {
        try {
            console.log(newReport);
            const response = await apiClient.post('https://localhost:7120/api/reports/add', {
                title: newReport.title,
                description: newReport.description,
                reportTypeId: newReport.reportTypeId.toString(),
                createdAt: new Date().toISOString(),
            });


                console.log(response);
                setReportData(prevData => [...prevData, response.data]);
                setNewReport({ title: "", description: "", reportTypeId: 1 });
                setIsAddingReport(false);
                navigate("/dashboard")

            
        } catch (error) {
            console.error("Rapor ekleme hatasý:", error);
            if (error?.response?.data) {
                console.log("Hata Detayý: ", error.response.data.errors || error.response.data);
            }
            alert("Rapor eklenemedi.");
        }
    };

    const deleteReport = async (taskId) => {
        try {
            const response = await axios.delete(`https://localhost:7120/api/reports/delete/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.message); 
            setReportData(prevData => prevData.filter(task => task.taskId !== taskId));
        } catch (error) {
            console.error("Rapor silme hatasý:", error);
            alert("Rapor silinirken hata oluþtu.");
        }
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
    };


    // status butonu için
    const toggleTaskStatus = async (taskId, currentStatus) => {
        if (currentStatus === true) {
            return;
        }
        try {
            const response = await apiClient.patch(`https://localhost:7120/api/reports/updateStatus/${taskId}`);
            if (response.status === 200) {
                setReportData(prevData =>
                    prevData.map(task =>
                        task.taskId === taskId ? { ...task, status: true } : task
                    )
                );
            }
        } catch (error) {
            console.error("Görev durumu güncellenemedi:", error);
        }
    };


    useEffect(() => {
        if (token) {
            fetchReportData(activeTab);
        }
    }, [activeTab, token]);

    return (
        <div className="dashboard-container">
            <div className="navbar">
                <div className="navbar-logo">
                    <h3>Dashboard</h3>
                </div>
                <div className="navbar-menu">
                    <button className="header-button logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Sol Menü */}
            <div className="sidebar">
                <div
                    className={`sidebar-item ${activeTab === "daily" ? "active" : ""}`}
                    onClick={() => handleTabClick("daily")}> Daily Reports </div>
                
                <div
                    className={`sidebar-item ${activeTab === "weekly" ? "active" : ""}`}
                    onClick={() => handleTabClick("weekly")}> Weekly Reports </div>
                
                <div
                    className={`sidebar-item ${activeTab === "monthly" ? "active" : ""}`}
                    onClick={() => handleTabClick("monthly")}> Monthly Reports </div>
               
                <div
                    className="sidebar-item"
                    onClick={() => setIsAddingReport(true)}> Report Add </div>
        
            </div>

            {/* Sað Rapor Alaný */}
            <div className="report-section">
                {activeTab && (
                    <div className="report-content">
                        <h2>
                            {activeTab === "daily" && "Daily"}
                            {activeTab === "weekly" && "Weekly"}
                            {activeTab === "monthly" && "Monthy"} Reports
                        </h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                                {reportData.length > 0 ? (
                                        reportData.map((task) => {

                                        // gün ay ve yýl formatýna çeviriyoruz ( createdate için )
                                        const formattedDate = new Date(task.createdAt).toLocaleDateString("tr-TR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        });

                                        // gün ay ve yýl formatýna çeviriyoruz ( FinishDate için )
                                        const formattedFinishDate = task.finishDate
                                        ? new Date(task.finishDate).toLocaleDateString("tr-TR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        }) : "Tarih yok";  

                                        return (
                                            <div key={task.taskId} className="task-container">
                                                <p><strong>Report title: </strong>{task.title}</p>
                                                <p><strong>Description: </strong> {task.description}</p>
                                                <p><strong>Created Date: </strong>{formattedDate}</p>
                                                <p><strong>Finish Date:</strong> {formattedFinishDate}</p>
                                                <label className="status-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.status}
                                                        onChange={() => toggleTaskStatus(task.taskId, task.status)}
                                                        disabled={task.status}  
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                                <button onClick={() => deleteReport(task.taskId)} className="delete-button">
                                                    <i className="fas fa-trash"></i> Sil
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>Rapor verisi alýnamadý.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Rapor ekleme formu */}
            {isAddingReport && (
                <div className="add-report-form">
                    <h2>Report Add</h2>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={newReport.title}
                        onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    />
                    <label>Description:</label>
                    <textarea
                        value={newReport.description}
                        onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    />
                    <label>Report Type:</label>
                    <select
                        value={newReport.reportTypeId}
                        onChange={(e) => setNewReport({ ...newReport, reportTypeId: parseInt(e.target.value) })}
                    >
                        <option value={1}>Daily</option>
                        <option value={2}>Weekly</option>
                        <option value={3}>Monthly</option>
                    </select>
                    <button onClick={handleAddReport}>Report add</button>
                    <button onClick={() => setIsAddingReport(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
