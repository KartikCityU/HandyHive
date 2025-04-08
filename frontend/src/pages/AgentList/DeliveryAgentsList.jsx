import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import DeliveryAgentCard from '../../components/DeliveryAgentCard/DeliveryAgentCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DeliveryAgentsList.css';

const DeliveryAgentsList = () => {
    const { url, service_categories } = useContext(StoreContext);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterActive, setFilterActive] = useState(false);
    const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'deliveries'
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [agentsPerPage] = useState(10);
    
    // Service types from the schema
    const serviceTypes = [
        'All',
        'Plumbing',
        'Electrician',
        'Cleaning',
        'HVAC',
        'Landscaping',
        'Appliance Repair',
        'Driver',
        'Home Repair'
    ];
    
    // Fetch all delivery agents
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/api/agents`);
                
                if (response.data.success) {
                    setAgents(response.data.data);
                } else {
                    toast.error("Failed to load delivery agents");
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        
        fetchAgents();
    }, [url]);
    
    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterActive, selectedCategory, sortBy]);
    
    // Filter and sort agents
    const filteredAndSortedAgents = [...agents]
        .filter(agent => {
            // Filter by active status if the filter is enabled
            const activeMatch = !filterActive || agent.activeStatus;
            
            // Filter by category if not set to 'All'
            const categoryMatch = selectedCategory === 'All' || agent.serviceType === selectedCategory;
            
            return activeMatch && categoryMatch;
        })
        .sort((a, b) => {
            if (sortBy === 'rating') {
                return b.rating - a.rating;
            } else {
                return b.completedServices - a.completedServices;
            }
        });
    
    // Pagination calculation
    const totalAgents = filteredAndSortedAgents.length;
    const totalPages = Math.ceil(totalAgents / agentsPerPage);
    
    // Get current page agents
    const indexOfLastAgent = currentPage * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    const currentAgents = filteredAndSortedAgents.slice(indexOfFirstAgent, indexOfLastAgent);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Next and previous page handlers
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    // Pagination component
    const Pagination = () => {
        if (totalPages <= 1) return null;
        
        return (
            <div className="pagination-container">
                <button 
                    className="pagination-button"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                >
                    &laquo; Previous
                </button>
                
                <div className="pagination-numbers">
                    {Array.from({ length: totalPages }).map((_, index) => {
                        // Show first, last, current and adjacent pages
                        const pageNumber = index + 1;
                        
                        // Always show first and last page
                        if (pageNumber === 1 || pageNumber === totalPages) {
                            return (
                                <button
                                    key={pageNumber}
                                    className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                                    onClick={() => paginate(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }
                        
                        // Show current page and adjacent pages
                        if (
                            pageNumber === currentPage ||
                            pageNumber === currentPage - 1 ||
                            pageNumber === currentPage + 1
                        ) {
                            return (
                                <button
                                    key={pageNumber}
                                    className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                                    onClick={() => paginate(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }
                        
                        // Show ellipsis for gaps
                        if (
                            (pageNumber === currentPage - 2 && currentPage > 3) ||
                            (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                            return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                        }
                        
                        return null;
                    })}
                </div>
                
                <button 
                    className="pagination-button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next &raquo;
                </button>
            </div>
        );
    };
    
    return (
        <div className="delivery-agents-list-container">
            <div className="agents-header">
                <h1>Our Service Partners</h1>
                <p>Meet our team of professional service agents ready to serve you</p>
            </div>
            
            <div className="agents-filter-controls">
                <div className="filter-options">
                    <div className="filter-option">
                        <label>
                            <input 
                                type="checkbox" 
                                checked={filterActive} 
                                onChange={() => setFilterActive(!filterActive)} 
                            />
                            Show only available agents
                        </label>
                    </div>
                    
                    <div className="category-filter">
                        <label>Filter by specialty:</label>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="category-select"
                        >
                            {serviceTypes.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="sort-options">
                    <span>Sort by:</span>
                    <button 
                        className={sortBy === 'rating' ? 'active' : ''} 
                        onClick={() => setSortBy('rating')}
                    >
                        Rating
                    </button>
                    <button 
                        className={sortBy === 'deliveries' ? 'active' : ''} 
                        onClick={() => setSortBy('deliveries')}
                    >
                        Experience
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="loading-agents">Loading service agents...</div>
            ) : filteredAndSortedAgents.length === 0 ? (
                <div className="no-agents-found">
                    <p>No service agents found matching your criteria.</p>
                    {selectedCategory !== 'All' && (
                        <p>Try changing the category filter or check back later.</p>
                    )}
                </div>
            ) : (
                <>
                    <div className="agents-grid">
                        {currentAgents.map(agent => (
                            <DeliveryAgentCard key={agent._id} agent={agent} />
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    <Pagination />
                </>
            )}
            
            {/* Results summary */}
            {!loading && filteredAndSortedAgents.length > 0 && (
                <div className="results-summary">
                    Showing {indexOfFirstAgent + 1} - {Math.min(indexOfLastAgent, totalAgents)} of {totalAgents} {selectedCategory !== 'All' ? selectedCategory : ''} agents
                </div>
            )}
        </div>
    );
};

export default DeliveryAgentsList;