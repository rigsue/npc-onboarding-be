import exprs from 'express';

const app = exprs();

app.use(exprs.json());
app.use(exprs.urlencoded({ extended: true }));

module.exports = app;