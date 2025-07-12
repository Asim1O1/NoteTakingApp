/**
 * Creates pagination options for Prisma queries
 * @param {Object} options - Pagination options
 * @param {number} options.page - Current page (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @param {string} options.orderBy - Field to sort by (default: 'createdAt')
 * @param {string} options.order - Sort direction ('asc' or 'desc', default: 'desc')
 * @returns {Object} Prisma findMany arguments
 */
export const createPagination = ({
  page = 1,
  limit = 10,
  orderBy = "createdAt",
  order = "desc",
} = {}) => {
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    orderBy: { [orderBy]: order },
  };
};

/**
 * Formats paginated response
 * @param {Object} data - Prisma query result
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Standardized pagination response
 */
export const formatPagination = (data, page, limit) => {
  const [items, totalCount] = Array.isArray(data)
    ? [data, data.length]
    : [data.items, data.totalCount];

  return {
    items,
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page * limit < totalCount,
      hasPrev: page > 1,
    },
  };
};
