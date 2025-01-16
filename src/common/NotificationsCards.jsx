import { format } from 'date-fns'
import ViewMoreSvg from "../../public/icons/view-more.svg";
import NoNotificationsSvg from "../../public/icons/no-notifications.svg";

// Function to group notifications by date
// Function to group and sort notifications by date
export const groupNotificationsByDate = (notifications) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const grouped = {
    Today: [],
    Yesterday: [],
    Older: [],
  };

  Object.keys(notifications).forEach((key) => {
    const sendedAt = new Date(notifications[key].sendedAt);

    // Check if the notification was sent today
    if (sendedAt.toDateString() === today.toDateString()) {
      grouped.Today.push({ id: key, ...notifications[key] });
    }
    // Check if the notification was sent yesterday
    else if (sendedAt.toDateString() === yesterday.toDateString()) {
      grouped.Yesterday.push({ id: key, ...notifications[key] });
    }
    // Otherwise, it belongs to the "Older" group
    else {
      grouped.Older.push({ id: key, ...notifications[key] });
    }
  });

  // Sort each group by `sendedAt` in descending order (newest first)
  Object.keys(grouped).forEach((group) => {
    grouped[group].sort((a, b) => new Date(b.sendedAt) - new Date(a.sendedAt));
  });

  return grouped;
};


export function NotificationsCards({ groupedNotifications }) {

  return (
    <>
      {groupedNotifications ? (
        Object.keys(groupedNotifications).map(
          (group) =>
            groupedNotifications[group].length > 0 && (
              <div key={group} className="notification-group">
                <h2 className="font-medium text-lg text-dark-blue">
                  {group}
                </h2>
                {groupedNotifications[group].map((notification) => (
                  <div
                    key={notification.id}
                    className="flex flex-col py-2.5 gap-1.5"
                  >
                    
                    <div className="flex w-full justify-between border border-[#D2D2D2]/50 gap-1.5 flex-col rounded-[20px] p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold">
                          {notification.title}
                        </h4>
                        <ViewMoreSvg />
                      </div>
                      <p className="text-sm">{notification.body}</p>
                      <div className="flex gap-2.5">
                        <button className="rounded-[20px] py-2.5 px-6 bg-main-blue font-roboto text-sm text-white">
                          Accept
                        </button>
                        <button className="rounded-[20px] py-2.5 px-6 font-roboto text-sm border border-[#D2D2D2] text-[#CAC8C8]">
                          Deny
                        </button>
                      </div>
                      <p className="opacity-40 text-sm">
                        {group} at{" "}
                        {format(new Date(notification.sendedAt), "hh:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
        )
      ) : (
        <div className="flex flex-col text-center items-center gap-2.5 py-6">
          <NoNotificationsSvg />
          <h4 className="font-semibold text-xl">No notifications yet</h4>
          <p className="opacity-40 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua
          </p>
        </div>
      )}
    </>
  );
}
