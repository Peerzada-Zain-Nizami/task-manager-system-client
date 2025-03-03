import React from "react";
import { motion } from "framer-motion";
import { useGetCompletionRate, useGetRecentActivities, useStats } from "../../hooks/dashboard";

const DashboardStats = () => {
  const { data: stats, isLoading } = useStats();
  const { data: recentActivities, isLoading: loadingRecentActivities } = useGetRecentActivities();
  const { data: completionRate, isLoading: loadingCompletionRate } = useGetCompletionRate();

  if (isLoading || loadingCompletionRate || loadingRecentActivities) return <div>Loading...</div>;
  if (!stats || !recentActivities || !completionRate) return <div>Error loading data</div>;

  const statsData = [
    {
      title: "Total Users",
      value: stats.total_users || 0,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      color: "bg-blue-500",
      details: [],
    },
    {
      title: "Total Tasks",
      value: stats.total_tasks || 0,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      color: "bg-green-500",
      details: [],
    },
    {
      title: "Categories",
      value: stats.total_categories || 0,
      icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
      color: "bg-purple-500",
      details: [],
    },
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const total = completionRate.completed + completionRate.in_progress + completionRate.pending;

  return (
    <div className="space-y-6">
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {statsData.map((card, index) => (
          <motion.div key={index} variants={itemVariants} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                <dd className="text-lg font-medium text-gray-900">{card.value.toLocaleString()}</dd>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-6 flow-root">
              <ul className="divide-y divide-gray-200">
                {recentActivities?.activities &&
                  recentActivities.activities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">{activity.user.name}</h3>
                            <p className="text-sm text-gray-500">{activity.updated_at}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {activity.status} task <span className="font-medium">{activity.title}</span>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Task Completion Rate</h3>
            <div className="mt-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">Completed</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-600">{Math.round((completionRate.completed / total) * 100)}%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                  <div
                    style={{ width: `${(completionRate.completed / total) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">In Progress</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-yellow-600">{Math.round((completionRate.in_progress / total) * 100)}%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                  <div
                    style={{ width: `${(completionRate.in_progress / total) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                  ></div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">Pending</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-red-600">{Math.round((completionRate.pending / total) * 100)}%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                  <div style={{ width: `${(completionRate.pending / total) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;
