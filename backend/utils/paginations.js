const paginate = async (Model, page = 1, limit = 10, query = {}) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
  
    // Lấy dữ liệu có phân trang
    const data = await Model.find(query).skip(skip).limit(limit);
    const totalRecords = await Model.countDocuments(query); // Tổng số bản ghi
  
    return {
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      data,
    };
  };
  
export default paginate;
  