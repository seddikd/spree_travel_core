//= require spree/frontend
//= require store/tab
//= require store/underscore
//= require store/cart_overlay
//= require store/datepicker
//= require jquery.ui.datepicker

// TODO: poner una clase en los elementos de busqueda y cambiar la busqueda
// por inputs a busqueda por clase
function params_data(product_id) {
    product_type = $('ul#search_box_tabs li.active a')[0].name;
    data = {
	product_id: product_id,
	product_type: product_type,
    };
    inputs = $('div#' + product_type + '_fields ul li input');
    inputs.each(function(index, element) {
	data[element.id] = element.value;
    });
    selects = $('div#' + product_type + '_fields ul li select');
    selects.each(function(index, element) {
	data[element.id] = element.value;
    });
    return data
}

function update_prices() {
    list = $('.ajax-price');
    $.each(list, function(index, object) {
        object = $(object);
        object.html('<img src="/assets/ajax-loader.gif" >');
        product_id = object.attr('data-product-hook');
        $.ajax({
            data_type: 'JSON',
            data: params_data(product_id),
            type: 'POST',
            url: '/products/get_ajax_price',
            success: function (result) {
		      prices = result.prices
              object.html(prices);
              hidden_id = "#vp_" + product_id;
              $(hidden_id).val(result.variant);
              b = $('#add-to-cart-button');
              if (prices.indexOf('Starting') != -1) {
                b.attr('disabled', true);
                b.addClass('disabled');
              } else {
                b.attr('disabled', false);
                b.removeClass('disabled');
              }
            },
            error: function() {
		      object.html('ERROR');
            }
        });
    });
    return false;
}

function fill_cart_hiddens(product_id) {
    template = $('#template-hidden');
    console.log(template);
    data = params_data(product_id);
    theform = $('#inside-product-cart-form');
    $.each(data, function(index, val) {
        index_name = index + "_cart_form";
        console.log(index_name);
        new_hidden = $('#'+index_name, theform);
        if (new_hidden.length == 0) {
            new_hidden = template.clone();
            new_hidden.attr('name', index);
            new_hidden.attr('id', index_name);
            console.log(new_hidden);
            theform.append(new_hidden);
        }
        new_hidden.val(val);
        console.log(index + ": " + val);
        console.log('------');
    });
    console.log('#######################################');
}

$(document).ready(function() {
    update_prices();
    $('#update_price').attr('onclick', 'update_prices()');
});
