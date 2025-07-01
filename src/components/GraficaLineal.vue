<template>
  <div id="chartdivLineal"></div>
</template>

<script setup>
import {
  onMounted,
  onBeforeUnmount,
  onBeforeUpdate,
  onUpdated,
  watchEffect,
  watch,
} from "vue";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/Animated";
import { ref } from "vue";
import { defineProps } from "vue";

//GRAFICA
// Definir prop de arreglo
const props = defineProps({
  data: {
    type: Array,
    required: true, // Verifica si la prop es obligatoria
    default: () => [], // Evita errores si no se pasa el prop
  },
  // showchart: {
  //   type: boolean,
  //   required: true, // Verifica si la prop es obligatoria
  //   default: () => false, // Evita errores si no se pasa el prop
  // },
});

var chart;
var showchart = 0;
const { data } = props;
// watchEffect(async () => {
//   // console.log("nuevo valor data: ", data);
// });
watch(
  () => props.data,
  (newVal) => { 
    // showchart = 1;
    setTimeout(() => {
      cargarChart(newVal);
    }, 1000);

    // cargarChart();
  }
); //

// watch(props, async (newValue) => {
//   debugger;
//   // alert();
//   if (newValue) {
//     // Aquí usas newValue, que es el valor más reciente
//     // Lógica con newValue
//     //const data = await fetchData();
//     // Actualiza dataRef si es necesario
//     // dataRef.value = data;
//   }
// });

// function desmontarChart() {
//       // Desmontar gráfico y ocultar el componente con transición
//       showchart = false;
//     };

function mostrarChart() {
  showchart = 1;
  cargarChart();
}

function cargarChart(newval) {
  am4core.useTheme(am4themes_animated);
  if (!chart) {
    chart = am4core.create("chartdivLineal", am4charts.XYChart);

    // var data = [];
    // var price1 = 1000;
    // // var price2 = 1200;
    // // var quantity = 30000;
    // for (var i = 0; i < 30; i++) {
    //   price1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
    //   data.push({ date1: new Date(2015, 0, i), price1: price1 });
    // }
    // for (var i = 0; i < 360; i++) {
    //   price2 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
    //   data.push({ date2: new Date(2017, 0, i), price2: price2 });
    // }

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.renderer.labels.template.fill = am4core.color("#e59165");

    // var dateAxis2 = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis2.renderer.grid.template.location = 0;
    // dateAxis2.renderer.labels.template.fill = am4core.color("#dfcc64");

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color("#e59165");

    valueAxis.renderer.minWidth = 60;

    // var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis2.tooltip.disabled = true;
    // valueAxis2.renderer.grid.template.strokeDasharray = "2,3";
    // valueAxis2.renderer.labels.template.fill = am4core.color("#dfcc64");
    // valueAxis2.renderer.minWidth = 60;

    var series = chart.series.push(new am4charts.LineSeries());
    series.name = "Monitoreo Temeperatura";
    series.dataFields.dateX = "Fecha";
    series.dataFields.valueY = "Temperatura";
    series.tooltipText = "{dateX}: [b]{valueY}[/]";
    series.fill = am4core.color("#e59165");
    series.stroke = am4core.color("#e59165");

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.stroke = am4core.color("#fff");
    bullet.circle.strokeWidth = 2;
    series.strokeWidth = 2;

    // var series2 = chart.series.push(new am4charts.LineSeries());
    // series2.name = "2017";
    // series2.dataFields.dateX = "date2";
    // series2.dataFields.valueY = "price2";
    // series2.yAxis = valueAxis2;
    // series2.xAxis = dateAxis2;
    // series2.tooltipText = "{valueY.value}";
    // series2.fill = am4core.color("#dfcc64");
    // series2.stroke = am4core.color("#dfcc64");
    // //series2.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();
    // chart.cursor.xAxis = dateAxis2;

    var scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    chart.legend = new am4charts.Legend();
    chart.legend.parent = chart.plotContainer;
    chart.legend.zIndex = 100;

    // valueAxis2.renderer.grid.template.strokeOpacity = 0.07;
    // dateAxis2.renderer.grid.template.strokeOpacity = 0.07;
    dateAxis.renderer.grid.template.strokeOpacity = 0.07;
    valueAxis.renderer.grid.template.strokeOpacity = 0.07;
  } else {
    chart.data = [];
  }
  chart.data = newval;
}
onMounted(() => {
  // if ((showchart = 0)) {
  //   chart.dispose();
  // }
  // showchart = 0;
  setTimeout(() => {
    cargarChart(data);
  }, 1000);

  // cargarChart();
}); // end am5.ready()

// Limpiar el gráfico al desmontar el componente
onBeforeUnmount(() => {
  if (chart) {
    // console.log('entra')
    chart.dispose(); // Liberar los recursos
  }
});
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
#chartdivLineal {
  width: 100%;
  height: 400px;
}
</style>
