var globalData = [];
var filterData = [];
var currentselected;
$(document).ready(function () {

    $("#searchInput").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: 'http://api.yummly.com/v1/api/recipes?_app_id=3d0fb9d5&_app_key=e8a01281f5c05105363c5b8acb70bb27',
                dataType: "json",
                data: {
                    term: request.term,
                    q: $("#searchInput").val()
                },
                success: function (data) {
                    var finalData = [];
                    for (i in data.matches) {
                        finalData.push(data.matches[i].recipeName);
                    }
                    response(finalData);
                }
            });
        }
    });

});
function getRecipeData(param) {
    debugger;
    var searchUrl = 'http://api.yummly.com/v1/api/recipes?_app_id=3d0fb9d5&_app_key=e8a01281f5c05105363c5b8acb70bb27&q=' + param;

    $.ajax({
        url: searchUrl,
        success: function (data) {
            $('#recipes').html('');
            globalData = [];

            $.each(data.matches, function (idx, obj) {
                debugger;
                var customimageurl = obj.smallImageUrls[0].replace("s90", "s560");
                globalData.push(obj);
                $('#recipes').append('<div class="abc"><div class="recipe"  onclick="OpenDetail(' + idx + ')">\
                     <div class="recipe-top">\
                           <a class="ui-username" href="javascript:;" target="_blank">' + obj.recipeName + '</a>\
                        </div>\
                        <div class="recipe-middle"><img class="recipe-image" src="' + customimageurl + '" alt="">\
                        <div class="hide"><input type="text"  value="' + obj.id + '" ></div>\
                        <div class="recipe-hover"><strong>Ingredients:</strong>' + obj.ingredients + '</div></div>\
                        <div class="recipe-bottom">\
                           <div class="recipe-notes">Rating: <strong>' + obj.rating + '</strong></div>\
                        </div>\
                  </div></div>');
                var showRecipes = setTimeout(function () {
                    $('.recipe').css({ 'opacity': 1, 'transform': 'translateY(0%)' });
                }, 1000);

            });
        }
    });
}


function OpenDetail(id) {
    debugger;

    var mytags = document.getElementsByClassName('hide');

    var recipeid = mytags[id].children[0].value;


    if (currentselected == null) currentselected = getParameterByName('type');
    var url = "DetailPage.html?val=" + recipeid + "&type=" + currentselected;

    //    if (currentselected == null) currentselected = getParameterByName('type');
    //    var url = "DetailPage.html?val=" + id + "&type=" + currentselected;
    window.open(url);
};



$(document).ready(function () {
    debugger;

    var isdetail = getParameterByName('val');

    if (isdetail != null && isdetail != "" && isdetail != undefined) {
      
        BindDetailRecipe();
    }
    else {
        getRecipeData('popular');
        currentselected = 'popular';
        $('#searchToggle').click(function () {

            if ($(this).text() == 'Search') {
                $(this).text('Menu');
                currentselected = $(this).text('Menu');
            } else {
                $(this).text('Search');
                currentselected = $(this).text('Menu');
            }
        })
        $('.nav li').click(function () {
            debugger;
            $('.nav li').removeClass('active');
            $(this).addClass('active');
            currentselected = $(this).text();
        })
    }
});

//for details data


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};



//for details

function getRecipeDetailsData(obj) {
    debugger;

    var myIngredients = '';
    var myCourse = '';
    var myCuisine = '';
    var myFlavors = '';

    if (obj.ingredientLines != null && obj.ingredientLines != undefined) {
        for (i in obj.ingredientLines) {
            myIngredients += obj.ingredientLines[i] + ',<br />';
        }
    } else {
        myIngredients = ' - ';
    }

    if (obj.name != '' && obj.name != undefined) {
        myCourse = obj.name
    } else {
        myCourse = ' - '
    }
    if (obj.flavors != null && obj.flavors != undefined) {
        for (i in obj.flavors) {
            myFlavors += i + ' - ' + obj.flavors[i] + ',<br />';
        }
    } else {
        myFlavors = ' - ';
    }

    $('#progressimg').addClass('hide');
    var customimageurl = obj.images[0].imageUrlsBySize["360"].replace("=s360", "=s600");

    var sourceurl = 'https://www.google.co.in/search?q=' + obj.source.sourceDisplayName;
    $('#datacontainer').append('<div class="container-fluid"><div class="modal-content"><div class="modal-header det-container-hdr">\
    <h4 class="modal-title">' + obj.name + '</h4>\
    </div><div class="modal-body">\
    <div class="col-sm-5"><img src="' + customimageurl + '" alt="" class="img-responsive"></div>\
                            <div class="col-sm-7">\
                             <div class="row">\
                               <div class="col-sm-5"><label>Source Display Name: </label></div><div class="col-sm-7"><a href="' + obj.source.sourceRecipeUrl + '" target="_blank">' + obj.source.sourceDisplayName + '</a></div>\
                               </div><div class="row">\
                               <div class="col-sm-5"><label>Ingredients: </label></div><div class="col-sm-7">' + myIngredients + '</div>\
                               </div><div class="row">\
                               <div class="col-sm-5"><label>Total Time In Seconds: </label></div><div class="col-sm-7">' + obj.totalTimeInSeconds + '</div>\
                               </div><div class="row">\
                               <div class="col-sm-5"><label>Course: </label></div><div class="col-sm-7">' + myCourse + '</div>\
                               </div><div class="row">\
                               <div class="col-sm-5"><label>Cuisine: </label></div><div class="col-sm-7">' + myCuisine + '</div>\
                               </div><div class="row">\
                               <div class="col-sm-5"><label>Flavors: </label></div><div class="col-sm-7">' + myFlavors + '</div>\
                               </div><div class="row"><div class="col-sm-5"><label>Rating: </label></div><div class="col-sm-7">' + obj.rating + '</div></div></div></div><br /></div></div>');
};

var BindDetailRecipe = function () {

    var recipeid = getParameterByName('val');
    var param = getParameterByName('type');
    var getUrl = "http://api.yummly.com/v1/api/recipe/" + recipeid + "?_app_id=3d0fb9d5&_app_key=e8a01281f5c05105363c5b8acb70bb27";
    $.ajax({
        url: getUrl,
        success: function (data) {
            globalData = [];
            getRecipeDetailsData(data);
        }
    });


    $('.nav li').click(function () {
        debugger;
        $('.nav li').removeClass('active');
        $(this).addClass('active');
        currentselected = $(this).text();
    });
};