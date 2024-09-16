
const getIndex = (req, res, next) => {
    res.render('index', { title: 'Express' });
}

export default getIndex;