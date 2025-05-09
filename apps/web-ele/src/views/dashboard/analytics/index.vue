<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisitsData from './analytics-visits-data.vue';
import AnalyticsVisitsSales from './analytics-visits-sales.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';
import AnalyticsVisits from './analytics-visits.vue';

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '当日授权课程数',
    totalTitle: '总授权课程数',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '日活跃老师数',
    totalTitle: '总活跃老师数',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '新增机构数',
    totalTitle: '机构总数',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellIcon,
    title: '新增学校数',
    totalTitle: '总学校数',
    totalValue: 50_000,
    value: 5000,
  },
  //
  {
    icon: SvgCardIcon,
    title: '当日浏览课程数',
    totalTitle: '总浏览课程数',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '当日新增课程数',
    totalTitle: '总课程数',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '当日课程到期数',
    totalTitle: '总课程到期数',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellIcon,
    title: '新增课程数',
    totalTitle: '总课程数',
    totalValue: 50_000,
    value: 5000,
  },
];

const chartTabs: TabOption[] = [
  {
    label: '登录次数',
    value: 'trends',
  },
  {
    label: '课程访问',
    value: 'visits',
  }
];
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
      <template #trends>
        <AnalyticsTrends />
      </template>
      <template #visits>
        <AnalyticsVisits />
      </template>
    </AnalysisChartsTabs>

    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="课件访问">
        <AnalyticsVisitsData />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="机构访问">
        <AnalyticsVisitsSource />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mt-0 md:w-1/3" title="老师访问">
        <AnalyticsVisitsSales />
      </AnalysisChartCard>
    </div>
  </div>
</template>
