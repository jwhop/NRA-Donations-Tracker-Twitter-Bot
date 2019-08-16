var Twitter = require('twit');
//var config = require('./config.js');
  
var jsond = require('./final_data.json');
var usrd0 = require('./twitdata_sen.json');
var usrd1 = require('./twitdata_house_ag.json');
var usrd2 = require('./twitdata_house_hr.json');
var usrd3 = require('./twitdata_house_sw.json');


test = "";
name = "";
arr_of_ids =[];

usrd0.forEach(function(element){
	test+=element.id_str;
	test+=',';
	arr_of_ids.push(element.id_str);
});
console.log(arr_of_ids.length);
usrd1.forEach(function(element){
	test+=element.id_str;
	test+=',';
	arr_of_ids.push(element.id_str);
});
console.log(arr_of_ids.length);

usrd2.forEach(function(element){
	test+=element.id_str;
	test+=',';
	arr_of_ids.push(element.id_str);
});
console.log(arr_of_ids.length);

usrd3.forEach(function(element){
	test+=element.id_str;
	test+=',';
	arr_of_ids.push(element.id_str);
});
console.log(arr_of_ids.length);
arr_of_ids.push('962916727620222977');
test = test.substr(0, test.length-1);
test += ',962916727620222977';
/*arr_of_ids.forEach(function(element){
	console.log(element) + '\n';
	
});*/

//console.log(test);
list_of_handles = "";
//console.log(name);
/*
jsond.forEach(function(element){
	list_of_handles += element.handle.substr(1, element.handle.length);
	list_of_handles += ',';
	
});
*/
//list_of_handles = list_of_handles.substr(0, list_of_handles.length-1);
//console.log(list_of_handles);


 var T = new Twitter({
        consumer_key: '0SaNNhm4Ymm4q9ZGF96DI852D',
        consumer_secret: 'eyT5adEFnWQIpUOISAAQjmS3OlFEdSxSUm67D9uZuGKZvZlvEV',
        access_token: '1159178242605105153-Y7OVV2UxjwuMLLE83GWsqWMf35utBq',
        access_token_secret: '9wRjgPipcnl0EVfC8E0gflqmIYoJTNAhm0VRBBhgU8Mep'
    });


console.log('Authentication successful. Running bot...\r\n')

var stream = T.stream('statuses/filter', {follow: test });
function isReply(tweet) {
  if ( tweet.retweeted_status
    || tweet.in_reply_to_status_id
    || tweet.in_reply_to_status_id_str
    || tweet.in_reply_to_user_id
    || tweet.in_reply_to_user_id_str
    || tweet.in_reply_to_screen_name )
    return true
}
function tweetContains(tweet) {
	arr = [' gun ', 'mass murder', 'shooting', 'El paso', 'Dayton', 'red flag', 'background checks', 'weapon'];
	value = 0;
	if(tweet.truncated){
	arr.forEach(function(word) {
		value = value + tweet.extended_tweet.full_text.toLowerCase().includes(word);
	});
	}
	else{
		arr.forEach(function(word) {
		value = value + tweet.text.toLowerCase().includes(word);
	});
	}
	return(value === 1)
	
}
stream.on('tweet', function (tweet) {
	
	if(!isReply(tweet)){
		if(tweetContains(tweet)){
			console.log(tweet);
			var ind_handle = jsond[arr_of_ids.indexOf(tweet.user.id_str)].handle;
			var ind_amount = jsond[arr_of_ids.indexOf(tweet.user.id_str)].amount;
			var ind_year = jsond[arr_of_ids.indexOf(tweet.user.id_str)].year;
			console.log(jsond[arr_of_ids.indexOf(tweet.user.id_str)]);
			//console.log(ind);
			//console.log(arr_of_ids.indexOf(tweet.user.id_str));
			if(ind_amount > 100)
			{
				T.post('statuses/update', { status: 'note: ' + ind_handle + ' has received $' + ind_amount + ' in donations from the NRA, with the most recent donations from the ' + ind_year + ' election cycle. All data was obtained via @OpenSecretsDC.',
					in_reply_to_status_id: '' + tweet.id_str }, function(err, data, response) {
				console.log("posted tweet!")
				});
				T.post('statuses/update', { status: 'note: ' + ind_handle + ' has received $' + ind_amount + ' in donations from the NRA, with the most recent donations from the ' + ind_year + ' election cycle. All data was obtained via @OpenSecretsDC. \n' +
				'twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
					}, function(err, data, response) {
				console.log("posted tweet!")
				});
			}

		}
	}
})
		
stream.on('error', function(err) {
	throw err;
});

