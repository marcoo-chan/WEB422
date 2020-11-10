/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Marco Chan Student ID: 152215182 Date: 10/08/2020
*
*
********************************************************************************/ 

let saleData = [];
let page = 1;
const perPage = 10;

const saleTableTemplate = _.template(
    `<% _.forEach(saleData, function(sale) { %>
        <tr data-id= <%- sale._id %>>
            <td><%- sale.customer.email %></td>
            <td><%- sale.storeLocation %></td>
            <td><%- sale.items.length %></td>
            <td><%- moment.utc(sale.saleDate).local().format("LLLL") %></td>
        </tr>
    <% }); %>`
);

const saleModelBodyTemplate = _.template(
    `<h4><strong>Customer</strong></h4>
    <strong>email: </strong> <%- obj.customer.email %><br>
    <strong>age: </strong> <%- obj.customer.age %><br>
    <strong>satisfaction: </strong> <%- obj.customer.satisfaction %> / 5
    <br><br>
    <h4><strong> Items: $<%- obj.total.toFixed(2) %> </strong></h4>

    <table class="table">
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <% _.forEach(obj.items, function(item) { %>
                <tr>
                    <td><%- item.name %></td>
                    <td><%- item.quantity %></td>
                    <td>$<%- item.price %></td>
                </tr>
            <% }); %>
        </tbody>
    </table>`
);

function loadSaleData() 
{
    fetch(`https://mysterious-reaches-11250.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`)
    
    .then(res => {
        return res.json();
    })

    .then(data => {
        saleData = data;
        let saleDataRows = saleTableTemplate({data:saleData});
        $("#sale-table tbody").html(saleDataRows);
        $("#current-page").html(page);
    })
};

$(function() 
{
    loadSaleData();

    $("#sale-table tbody").on("click", "tr", function(e) 
    {
        let clickedId = $(this).attr("data-id");

        let clickedSale = _.find(saleData, function(o)
        {
            return o._id == clickedId;
        });

        clickedSale.total = 0;

        for (let i = 0; i < clickedSale.items.length; i++)
        {
            clickedSale.total += (clickedSale.items[i].price * clickedSale.items[i].quantity);
        }

        $(".modal-title").html(`<b>Sale: ${clickedSale._id}<b>`);
        $(".modal-body").html(saleModelBodyTemplate(clickedSale));

        $("#sale-modal").modal
        ({
            backdrop: "static",
            keyboard: false
        });
    })
});

$("#previous-page").on("click", function()
{
    if (page > 1)
    {
        page -= 1;
    }

    loadSaleData();
});

$("#next-page").on("click", function()
{
    page++;
    loadSaleData();
});

