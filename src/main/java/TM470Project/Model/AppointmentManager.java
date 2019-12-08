package TM470Project.Model;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.LinkedList;
import java.util.NoSuchElementException;

/**
 * an interface for classes that make use of Appointment objects.
 * @author Luke Daniels.
 */
interface AppointmentManager {

    LinkedList<Appointment> appointments = new LinkedList<>();

    /**
     * @param day       the day to check for appointment slot.
     * @param startTime the start time of the appointment slot.
     * @param endTime   the end time of the appointment slot.
     * @return          a Boolean to confirm if the appointment slot is free.
     */
    default Boolean checkFree(DayOfWeek day, LocalTime startTime, LocalTime endTime) {
        for (Appointment app : appointments) {
            if (app.getDayObject().getValue() == day.getValue()) {
                if (app.getEndTime().isAfter(startTime) && app.getStartTime().isBefore(endTime))
                    return false;
            }
        }
        return true;
    }

    default void setAppointment(Appointment app)
    {
        this.appointments.add(app);
    }

    void setAppointment(DayOfWeek day, LocalTime startTime, LocalTime endTime,
                        Client client, SupportStaffMember staffMember);

    default void removeAppointment(Appointment app)
    {
        this.appointments.remove(app);
    }

    /**
     * returns an appointment object that matches the provided attributes.
     * @param day       the day of the appointment to find.
     * @param startTime the start time of the appointment to find.
     * @param endTime   the end time of the appointment to find.
     * @return          the appointment object that matches the provided attributes returned.
     * @throws NoSuchElementException   if not appointment object matches a error is thrown.
     */
    default Appointment getAppointment(DayOfWeek day, LocalTime startTime, LocalTime endTime) {
        for (Appointment app : appointments) {
            if (app.getDayObject().equals(day) && app.getStartTime().equals(startTime) && app.getEndTime().equals(endTime)) {
                return app;
            }
        }
        throw new NoSuchElementException("The appointment with the selected day and times does not exist");
    }

    /**
     * turns if the support staff member has any appointments.
     * @return true true if they have appointment or false if not.
     */
    default Boolean hasAppointment()
    {
        return this.appointments.size() > 0;
    }

}
