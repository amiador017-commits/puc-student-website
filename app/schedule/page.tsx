import { getServerSession } from "../../lib/server-session";
import { getScheduleDataServer } from "../../lib/server-data";
import ScheduleClient from "./ScheduleClient";

export default async function SchedulePage() {
  const user = await getServerSession();

  if (user) {
    const { scheduleEntries, totalCourses } = await getScheduleDataServer(
      user.semester,
      user.section
    );
    return (
      <ScheduleClient
        initialUser={user}
        initialSchedule={scheduleEntries}
        initialTotalCourses={totalCourses}
      />
    );
  }

  return (
    <ScheduleClient
      initialUser={null}
      initialSchedule={[]}
      initialTotalCourses={0}
    />
  );
}
