/*

Simple blog front end demo in order to learn AngularJS - You can add new posts, add comments, and like posts.

*/

(function(){
  var app = angular.module('blogApp',[]);
  
  app.controller('BlogController', ['$http', function($http){
    
     var blog = this;
    
    
    blog.posts = {};
    blog.users = {};

    $http.get('http://localhost:3000/posts').success(function(data){
      blog.posts = data.data;
      
    });
    
    

    

    blog.tab = 'blog';
    
    blog.selectTab = function(setTab){
      blog.tab = setTab;
      console.log(blog.tab)
    };
    
    blog.isSelected = function(checkTab){
      return blog.tab === checkTab;
    };
    
    blog.post = {};
    blog.addPost = function(){
      blog.post.createdOn = Date.now();
      blog.post.comments = [];
      blog.post.likes = 0;
      blog.posts.unshift(this.post);
      blog.tab = 0;
      blog.post ={};
    };   
    
  }]);

  /*app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
  });
*/
  
 app.controller('postController', function($scope, $http,$window ) {
  
    $scope.message = 'New Post Page';
    $scope.post = {};
    $scope.data = {};
    
    $scope.newpost = function() {
      
      console.log($scope.post);
      $scope.data = {post : $scope.post};
      console.log($scope.data);
      $http({
        method : 'POST',
        url : 'http://localhost:3000/posts',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.data
      })
      .then(function(response)
      {
        $scope.msg = response.data;
      })
      $window.location.href = 'http://localhost:8000';
    }

    
  });




  app.controller('loginController', function($scope, $http) {
    $scope.message = 'Login Page';
    $scope.user = {};
      $scope.newuser = {};
    $scope.session = {};
    $scope.data = {};
    $scope.signup = function() {
      
      console.log($scope.user);
      $scope.newuser = {user : $scope.user};
      console.log($scope.newuser);
      $http({
        method : 'POST',
        url : 'http://localhost:3000/users',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.newuser
      })
      .then(function(response)
      {
        $scope.msg = response.data;
      })
    }

    $scope.signin = function() {
     console.log($scope.session);
      $scope.data = {session : $scope.session};
      console.log($scope.data);
      $http({
        method : 'POST',
        url : 'http://localhost:3000/login',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.data
      })
      .then(function(response)
      {
        $scope.msg = response.data;
      })
    }
  });



  
  app.controller('CommentController', function($scope,$http,$window){
    /*this.comment = {};
    this.addComment = function(post){
      this.comment.createdOn = Date.now();
      post.comments.push(this.comment);
      this.comment ={};
    };*/
   this.comment={}
     this.addcomment = function(post){
      this.comment.createdOn = Date.now();
      post.attributes.comments.push(this.comment);
      this.comment ={};
    }



   /* $scope.addlike = function(){
      $http({
        method : 'POST',
        url  : 'http://localhost:3000/like/{{post.id}}',
        headers: {
          'Content-Type': "application/json"
        },
      })
     
    }*/
    

    $scope.comment={};
    $scope.data={};
    
 
    
    $scope.newcomment = function() {
      console.log($scope.comment);
      $scope.data = {comment : $scope.comment};
      console.log($scope.data);
        $http({
        method : 'POST',
        url : 'http://localhost:3000/comments',
        headers: {
          'Content-Type': "application/json"
        },
        data : $scope.data
      })
      .then(function(response)
      {
        $scope.msg = response.data;
      })

      $window.location.href = 'http://localhost:8001';

    }

  });
 
})();


//1var app = angular.module('app', ['ngRoute']);




  