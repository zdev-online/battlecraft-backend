module.exports  = async (model, page, where = {}, attributes = []) => {
    let limit   =  10;
    let offset  = 0 + (page - 1) * limit;
    let data    = (await model.findAndCountAll({ limit, offset, where, attributes })).toJSON();
    data.current_page   = ++page;
    data.page_count     = Math.ceil(data.count / limit);
    data.data           = data.rows;
    delete data.rows;
    return data;
}