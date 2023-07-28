<template>
  <el-alert v-if="isShowWarning" title="提醒" type="error"  style="margin-top: 10px;margin-bottom: 10px;">
    <div style="font-size: 35px;font-weight: bold;">
      加油，你是最棒的，今日还有 {{ Math.max(0,userDaliyCreation - statistics.today.contribution.creation) }} 个哦！
    </div>
  </el-alert>
  <el-row :gutter="20" style="margin-bottom: 20px;">
    <el-col :span="8">
      <el-card class="box-card" style="height: 100%;">
        <template #header>
          <div class="card-header">
            <span>账号信息</span>
          </div>
        </template>
        <!-- <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div> -->
        <div>登陆身份: {{ store.user.role }}</div>
        <div>用户名: {{ store.user.name }}</div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>统计</span>
          </div>
        </template>
        <el-row>
          <el-col :span="6">
              <el-statistic :value="statistics.all.contribution.creation">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    我的贡献/总客户数
                  </div>
                </template>
                <template #suffix>/{{ statistics.all.creation.length }}</template>
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="今日贡献" :value="statistics.today.contribution.creation" />
            </el-col>
            <el-col :span="6">
              <el-statistic :value="statistics.all.contribution.sign">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    我的签约/总签约数
                  </div>
                </template>
                <template #suffix>/{{ statistics.all.sign.length }}</template>
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="今日签约" :value="statistics.today.contribution.sign" />
            </el-col>
        </el-row>
        <!-- <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div> -->
        <div>
          <!-- 登陆身份:  -->
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="10">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>进七天动态</span>
          </div>
        </template>
        <div ref="chart_element" style="height: 500px;"></div>
      </el-card>
    </el-col>

    <el-col :span="10">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>成员贡献占比</span>
          </div>
        </template>
        <div ref="chart_element2" style="height: 500px;"></div>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card class="box-card" style="height: 100%;">
        <template #header>
          <div class="card-header">
            <span>今日小目标</span>
          </div>
          
        </template>
        <!-- <el-statistic :value="statistics.today.contribution.creation" class="statisic-card">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              每日入库
            </div>
          </template>
          <template #suffix>/settings.dailyCreation</template>
        </el-statistic> -->
        <!-- percentage 省略小数点后两位 -->
        <el-progress type="circle" :percentage="Number((statistics.today.contribution.creation/userDaliyCreation).toFixed(2))*100" />
        <br>
        <el-text size="small">每日入库</el-text>
        <br>
        <el-divider />
        <br>
        <!-- <el-progress type="circle" :percentage="statistics.today.contribution.sign/10" /> -->
        <el-statistic :value="statistics.today.contribution.sign" class="statisic-card">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              每日签约
            </div>
          </template>
          <!-- <template #suffix>/NaN</template> -->
        </el-statistic>
        <el-divider />
        <el-button @click="saveCustomers" v-if="store.user.role == 'admin'">导出客户</el-button>
        <el-button type="primary" @click="reportDialogVisible = true" v-if="store.user.role == 'admin'">导出报告</el-button>
        <!-- exportReport -->
        <el-dialog
          v-model="reportDialogVisible"
          title="导出信息"
          width="30%"
          align-center
        >
          <div>
            <el-form label-width="80px">
              <el-form-item label="导出范围">
                <el-date-picker
                  v-model="reportDate"
                  type="daterange"
                  range-separator="到"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  size="small"
                />
              </el-form-item>
            </el-form>
            
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="reportDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="reportDialogVisible = false,exportReport(reportDate)">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { useLoginStore } from "../store";
import getStatistics, { Response } from "../api/statistics";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import * as echarts from "echarts"
import { chartOptions, baseLine1, baseLine2, chartOptions2 } from "../utils/chartOptions"
import groupStatisics from "../utils/groupStatisics"
import user from "../api/user";
import exportReport from "../utils/exportReport";
import saveCustomers from "../utils/saveCustomer";

const store = useLoginStore();

var userDaliyCreation = ref(0)

const getSettings = async () => {
  // @ts-ignore
  userDaliyCreation.value = (await user.getUser(store.token)).dailyCreation
  console.log("读取到云端配置",userDaliyCreation);
}

getSettings()

const chart_element = ref<HTMLDivElement>()
const chart_element2 = ref<HTMLDivElement>()

var chart: echarts.ECharts;
var chart2: echarts.ECharts;

// function isTimeBetween5and630(): boolean {
function isTimeBetween5and630(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours === 17 && minutes >= 0 || hours === 18 && minutes <= 30 || hours > 17 && hours < 18;
}

const reportDate = ref()

watch(reportDate,console.log)

const reportDialogVisible = ref(false)

const isShowWarning = computed(isTimeBetween5and630)

const initChart = () => {
  chart = echarts.init(chart_element.value)
  chart.setOption(chartOptions)
  chart2 = echarts.init(chart_element2.value)
  chart2.setOption(chartOptions2)
  return;
}

onMounted(() => nextTick(initChart))

const statistics = reactive<{
  today: Response["data"];
  all: Response["data"];
}>({
  // @ts-ignore
  today: {
    creation: [],
    sign: [],
    contribution: {
      creation: 0,
      sign: 0
    }
  },
  // @ts-ignore
  all: {
    creation: [],
    sign: [],
    contribution: {
      creation: 0,
      sign: 0
    }
  }
})

const getCustomerCount = (statisticsByDay: Record<string,any>) => {
  const today = new Date().getFullYear() + new Date().getMonth() + 1 + new Date().getDate()
  const customerCount = [];
  for (let index = 6; index >= 0; index--) {
    // console.log(today,statisticsByDay[today-index]);
    if(statisticsByDay[today-index]) customerCount.push(statisticsByDay[today-index].length)
    else customerCount.push(0)
  }
  return customerCount
}



const getData = async () => {
  statistics.today = (await getStatistics({today: true,oid: store.user.id})).data;
  statistics.all = (await getStatistics({oid: store.user.id})).data;
  
  const statisticsByDay = {
    // @ts-ignore
    creation: groupStatisics(statistics.all.creation),
    // @ts-ignore
    sign: groupStatisics(statistics.all.sign),
  };
  
  const dateArray = statistics.all.creation.map(item => item.date).sort()
  reportDate.value = [dateArray[0],dateArray.reverse()[0]]
  console.log(reportDate.value);
  
  // debugger
  // @ts-ignore
  const users = new Map((await user.getUser("name")).users.map((user) => [user.id, user.name]));

  var memberContribution: any = {}
  statistics.all.creation.map(item => {
    if(item.operator == -1) return;
    const uname = users.get(item.operator) as string
    if(!memberContribution[uname]) memberContribution[uname] = 0
    memberContribution[uname] ++;      
  })

  // @ts-ignore
  const contributionArray = []

  for (const item in memberContribution) {
    contributionArray.push({
      name: item,
      value: memberContribution[item]
    })
  }
  
  setTimeout(() => {
    chart.setOption({
      series: [
        {
          ...baseLine1,
          name: '日进库客户', 
          data: getCustomerCount(statisticsByDay.creation)
        },
        {
          ...baseLine2,
          name: '日签约客户', 
          data: getCustomerCount(statisticsByDay.sign)
        }
      ]
    })
    chart2.setOption({
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          // @ts-ignore
          data: contributionArray
        }
      ]
    })
  },0)
}
getData();
</script>
<style scoped>
.el-col {
  text-align: center;
}

.statisic-card {
  margin: 10px;
  height: 100px;
  /* display: flex; */
}
</style>