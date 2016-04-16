'use strict';

angular.module('confusionApp')

    .controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;
        $scope.showMenu = false;
        $scope.message = "Loading Menu...";
        $scope.dishes = [];

        menuFactory.getDishes()
            .then(function (response) {
                $scope.dishes = response.data;
                $scope.showMenu = true;
            }, function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

        $scope.select = function (setTab) {
            $scope.tab = setTab;

            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('ContactController', ['$scope', function ($scope) {

        $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

        var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', function ($scope) {

        $scope.sendFeedback = function () {

            console.log($scope.feedback);

            if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
                $scope.feedback.mychannel = "";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function ($scope, $stateParams, menuFactory) {

        var id = $stateParams.id;
        var baseSystem = 10;
        $scope.showDish = false;
        $scope.message="Loading Dish...";
        $scope.dish = {};

        menuFactory.getDish(parseInt(id, baseSystem))
            .then(function(response){
                $scope.dish = response.data;
                $scope.showDish = true;
            } , function(response){
                $scope.message = "Error: " + response.status + " " + response.statusText;
            })
        ;

    }])

    .controller('DishCommentController', ['$scope', function ($scope) {

        //Step 1: Create a JavaScript object to hold the comment from the form
        $scope.newComment = {author: "", rating: '5', comment: "", date: new Date().toISOString()};

        $scope.commentPreview = false;

        $scope.submitComment = function () {

            //Step 2: This is how you record the date
            //"The date property of your JavaScript object holding the comment" = new Date().toISOString();
            $scope.newComment.date = new Date().toISOString();

            // Step 3: Push your comment into the dish's comment array
            $scope.dish.comments.push($scope.newComment);

            //Step 4: reset your form to pristine
            $scope.commentForm.$setPristine();

            //Step 5: reset your JavaScript object that holds your comment
            $scope.newComment = {author: "", rating: '5', comment: ""};
        };


    }])


    .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function ($scope, menuFactory, corporateFactory) {

        $scope.promotion = menuFactory.getPromotion(0);

        $scope.leader = corporateFactory.getLeader(3);

        $scope.showDish = false;
        $scope.message="Loading Dish...";
        $scope.featuredDish = {};

        menuFactory.getDish(0)
            .then(function(response){
                $scope.featuredDish = response.data;
                $scope.showDish = true;
            }, function(response){
                $scope.message = "Error: " + response.status + " " + response.statusText;
            })

        ;
    }])


    .controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

        $scope.leaders = corporateFactory.getLeaders();

    }])
;
