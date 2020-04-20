$(document).ready(function ready(){
var Active_energy_Today;
var Average_Current;
var Average_Voltage; 
var B_phase_Active_Energy; 
var B_Phase_Active_Power; 
var B_Phase_Current; 
var B_Phase_Power_Factor; 
var B_Phase_Voltage;
var System_Apparent_Power; 
var Frequency;
var Ph_Ph_Voltage; 
var R_Phase_Active_power; 
var R_Phase_Current;
var R_Phase_Power_Factor; 
var R_Phase_Voltage;
var Sysem_Active_Energy;
var System_Active_Power;
var System_Power_Factor;
var Y_Phase_Active_power;
var Y_Phase_Current;
var Y_Phase_Power_Factor;
var Y_Phase_Voltage;
var Date;
var Time;
var TimeStamp;
var Month;
		var mqtt;
		var reconnectTimeout = 2000;
		var host="192.168.2.170";
		var port=9001;
		
		function onFailure(message) {
			//console.log("Connection Attempt to Host "+host+"Failed");
			setTimeout(MQTTconnect, reconnectTimeout);
        }
		function onMessageArrived(msg){
			out_msg="Message received "+msg.payloadString+"<br>";
			out_msg=out_msg+"Message received Topic "+msg.destinationName;
			var obj = JSON.parse(msg.payloadString);
			Active_energy_Today =obj.Active_energy_Today;
			System_Active_Power = obj.PLC.System_Active_Power;
			System_Apparent_Power = obj.PLC.System_Apparent_Power;
			Frequency = obj.PLC.Frequency;
			System_Power_Factor = obj.PLC.System_Power_Factor;
			var Active_energy_month = obj.Active_energy_Month;
			document.getElementById("Active_energy").innerHTML = (+Active_energy_Today).toFixed(2) + " KWh";
			document.getElementById("Cost").innerHTML = "Rs "+ (+Active_energy_Today * 8.5).toFixed(2);//(+obj.Average_Current).toFixed(2);
			document.getElementById("Active_energy_month").innerHTML = (+Active_energy_month).toFixed(2) + " KWh";
			document.getElementById("Month_cost").innerHTML = "Rs "+ (+Active_energy_month * 8.5).toFixed(2);
			Active_power.setValueAnimated(System_Active_Power/1000);
			Apparent_power.setValueAnimated(System_Apparent_Power/1000);
			frequency.setValueAnimated(Frequency);
			power_factor.setValueAnimated(System_Power_Factor);
			
			//console.log(out_msg);

		}
		
	 	function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	
		//console.log("Connected ");
		mqtt.subscribe("#");
		message = new Messaging.Message("Hello World");
		message.destinationName = "sensor1";
		//mqtt.send(message);
	  }
	  function MQTTconnect() {
		//console.log("connecting to "+ host +" "+ port);
		mqtt = new Messaging.Client("165.22.214.242", 9001, "myclientid_" + parseInt(Math.random() * 100, 10));
		var options = {
			userName: "Evio",
			password: "Evio@2020",
			timeout: 3,
			onSuccess: onConnect,
			onFailure: onFailure,
			 };
		mqtt.onMessageArrived = onMessageArrived
		
		mqtt.connect(options); //connect
		}
	
	
	
	MQTTconnect();
	
	var Active_power = Gauge(
    document.getElementById("Active_power"),
    {
      dialStartAngle: 180,
      dialEndAngle: 0,
	  max: 100,
      value: 8,
	  label: function(value) {
            return (Math.round(value * 100) / 100) + " KWh";
          },
	  color: function(value) {
        if(value < 30) {
          return "#5ee432";
        }else if(value < 65) {
          return "#fffa50";
        }else if(value < 100) {
          return "#f7aa38";
        }else {
          return "#ef4655";
        }
      }
    }
  );
  
  	var Apparent_power = Gauge(
    document.getElementById("Apparent_power"),
    {
      dialStartAngle: 180,
      dialEndAngle: 0,
	  max: 100,
      value: 100,
	  label: function(value) {
            return (Math.round(value * 100) / 100) + " VA";
          },
	  color: function(value) {
        if(value < 30) {
          return "#5ee432";
        }else if(value < 65) {
          return "#fffa50";
        }else if(value < 100) {
          return "#f7aa38";
        }else {
          return "#ef4655";
        }
      }
    }
  );
  
  	var frequency = Gauge(
    document.getElementById("frequency"),
    {
      dialStartAngle: 180,
      dialEndAngle: 0,
	  max: 100,
      value: 100,
	  label: function(value) {
            return (Math.round(value * 100) / 100) + " Hz";
          },
	  color: function(value) {
        if(value < 20) {
          return "#5ee432";
        }else if(value < 50) {
          return "#fffa50";
        }else if(value < 100) {
          return "#f7aa38";
        }else {
          return "#ef4655";
        }
      }
    }
  );
  
  	var power_factor = Gauge(
    document.getElementById("power_factor"),
    {
      dialStartAngle: 180,
      dialEndAngle: 0,
	  max: 2,
	  min: -2,
      value: 100,
	  label: function(value) {
            return (Math.round(value * 100) / 100);
          }
    }
  );
  
  
   var table = $('#example').DataTable( {
        "ajax": {
            "url": "http://165.22.214.242:1880/test",
			"type" : "POST",
            "dataSrc": ""
        },
        "columns": [
			{ "data": "Date" },
			{ "data": "Time" },
            { "data": "R_Phase_Current" },
            { "data": "Y_Phase_Current" },
            { "data": "B_Phase_Current" }
			
        ]
    } );
	setInterval( function () {
    table.ajax.reload();
}, 25000 );
      var ctx = $("#mycanvas");

      var LineGraph = new Chart(ctx, {
        type: 'line',
options: {
	    responsive: true,
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            gridLines: {
                drawOnChartArea: false
            }
        }],
        yAxes: [{
            gridLines: {
                drawOnChartArea: false
            }
        }]
    },
            tooltips: {
                mode: 'label'
            }
},
        data: {
        labels: [],
        datasets: [
          {
            label: "Y_Phase_Current",
            fill: false,
            lineTension: 0.01,
			pointRadius: 1.5,
            backgroundColor: "rgb(255, 255, 0)",
            borderColor: "rgb(230, 230, 0)",
            //pointHoverBackgroundColor: "rgb(230, 230, 0)",
            //pointHoverBorderColor: "rgb(230, 230, 0)",
            data: []
          },
          {
            label: "B_Phase_Current",
            fill: false,
            lineTension: 0.01,
			pointRadius: 1.5,
            backgroundColor: "rgba(29, 202, 255, 0.75)",
            borderColor: "rgba(29, 202, 255, 1)",
            //pointHoverBackgroundColor: "rgba(29, 202, 255, 1)",
            //pointHoverBorderColor: "rgba(29, 202, 255, 1)",
            data: []
          },
          {
            label: "R_Phase_Current",
            fill: false,
            lineTension: 0.01,
			pointRadius: 1.5,
            backgroundColor: "rgba(211, 72, 54, 0.75)",
            borderColor: "rgba(211, 72, 54, 1)",
            //pointHoverBackgroundColor: "rgba(211, 72, 54, 1)",
            //pointHoverBorderColor: "rgba(211, 72, 54, 1)",
            data: []
          }
        ]
		}
		
      });
	  
	  
	  
	  var getData = function() {
  $.ajax({
    url : "http://165.22.214.242:1880/test",
    type : "POST",
    success: function(data1) {
      console.log(data1);
    /*  var Time = [];
      var Y_Phase_Current = [];
      var B_Phase_Current = [];
      var R_Phase_Current = [];

      for(var i in data) {
        Time.push(data[i].Time);
        Y_Phase_Current.push(data[i].Y_Phase_Current);
        B_Phase_Current.push(data[i].B_Phase_Current);
        R_Phase_Current.push(data[i].R_Phase_Current);
      }*/
      // add new label and data point to chart's underlying data structures
      LineGraph.data.labels.push(data1[0].Time);
      LineGraph.data.datasets[0].data.push(data1[0].Y_Phase_Current);
	  LineGraph.data.datasets[1].data.push(data1[0].B_Phase_Current);
	  LineGraph.data.datasets[2].data.push(data1[0].R_Phase_Current);
      
      // re-render the chart
      LineGraph.update();
	  
    }
  });
};

// get new data every 3 seconds
setInterval(getData, 25000);
});