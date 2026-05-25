package com.example.zootopia.ecommerce.Controller;

import com.example.zootopia.ecommerce.Entity.Appointment;
import com.example.zootopia.ecommerce.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Get all appointments (Admin only)
    @GetMapping("/getAppointment")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getAllAppointments();
            System.out.println("Retrieved " + appointments.size() + " appointments");
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create appointment (Customer)
    @PostMapping("/postAppointment")
    public ResponseEntity<?> addAppointment(@RequestBody Appointment appointment) {
        try {
            System.out.println("Received appointment creation request:");
            System.out.println("  - Email: " + appointment.getEmail());
            System.out.println("  - Contact No: " + appointment.getContactNo());
            System.out.println("  - Date: " + appointment.getDate());
            System.out.println("  - Time: " + appointment.getTime());
            System.out.println("  - Service: " + appointment.getGroomService());
            System.out.println("  - Price: " + appointment.getPrice());
            System.out.println("  - Confirmed: " + appointment.isConfirmed());
            System.out.println("  - Canceled: " + appointment.isCanceled());
            
            Appointment savedAppointment = appointmentService.addAppointment(appointment);
            return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error creating appointment: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update appointment
    @PutMapping("/putAppointment/{appId}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long appId, @RequestBody Appointment appointment) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointment(appId, appointment);
            return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error updating appointment: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete appointment (Admin only)
    @DeleteMapping("/deleteAppointment/{appId}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long appId) {
        try {
            String response = appointmentService.deleteAppointment(appId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error deleting appointment: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Cancel appointment (Admin only)
    @PutMapping("/cancel/{appId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appId) {
        try {
            // Find the appointment by appId
            Appointment appointment = appointmentService.getAppointmentById(appId);
            if (appointment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");
            }

            // Check if already canceled
            if (appointment.isCanceled()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Appointment is already canceled.");
            }

            // Update the canceled flag to true
            appointment.setCanceled(true);
            appointment.setConfirmed(false);

            // Save the updated appointment
            String response = appointmentService.updateAppointment(appointment);

            if (response.equals("Appointment successfully updated.")) {
                return ResponseEntity.ok("Appointment successfully canceled.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel appointment.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error canceling appointment: " + e.getMessage());
        }
    }

    // Confirm appointment (Admin only)
    @PutMapping("/confirm/{appId}")
    public ResponseEntity<String> confirmAppointment(@PathVariable Long appId) {
        try {
            // Find the appointment by appId
            Appointment appointment = appointmentService.getAppointmentById(appId);

            if (appointment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");
            }

            // Check if already confirmed
            if (appointment.isConfirmed()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Appointment is already confirmed.");
            }
            
            // Check if canceled
            if (appointment.isCanceled()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot confirm a canceled appointment.");
            }
            
            // Update the confirmed flag to true
            appointment.setConfirmed(true);

            // Save the updated appointment
            String response = appointmentService.updateAppointment(appointment);

            if (response.equals("Appointment successfully updated.")) {
                return ResponseEntity.ok("Appointment successfully confirmed.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to confirm appointment.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error confirming appointment: " + e.getMessage());
        }
    }

    // Get appointments by user email
    @GetMapping("/byUserEmail/{email}")
    public ResponseEntity<List<Appointment>> getAppointmentsByUserEmail(@PathVariable String email) {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByUserEmail(email);
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}