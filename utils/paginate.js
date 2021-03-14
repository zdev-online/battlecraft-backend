module.exports  = async (model, page, where = {}) => {
    if(page <= 0){ return { data: [] };}
    let limit   =  10;
    let offset  = 0 + (page - 1) * limit;
    let data    = await model.findAndCountAll({ limit, offset, where });
    data.current_page   = Number(page);
    data.page_count     = Math.ceil(data.count / limit);
    data.data           = data.rows.map((item) => item.toJSON());
    delete data.rows;
    return data;
}
