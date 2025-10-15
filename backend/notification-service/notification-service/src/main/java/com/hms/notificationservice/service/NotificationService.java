package com.hms.notificationservice.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.notificationservice.config.SendGridConfig;
import com.hms.notificationservice.config.TwilioConfig;
import com.hms.notificationservice.dto.NotificationDTO;
import com.hms.notificationservice.model.Notification;
import com.hms.notificationservice.repository.NotificationRepository;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class NotificationService {

	@Autowired
	private NotificationRepository notificationRepository;
	
	@Autowired 
	private SendGridConfig sendGridConfig;
	
	@Autowired
	private TwilioConfig twilioConfig;
	
	public Notification send(NotificationDTO dto) {
		Notification notification = new Notification();
		notification.setRecipientId(dto.recipientId);
		notification.setMessage(dto.message);
		notification.setType(dto.type);
		notification.setSentAt(LocalDateTime.now());
		
		if ("EMAIL".equalsIgnoreCase(dto.type)) {
		    sendEmail(dto.message, dto.recipientEmail);
		} else if ("SMS".equalsIgnoreCase(dto.type)) {
		    sendSms(dto.message, dto.recipientContact);
		}
		
//		if ("EMAIL".equalsIgnoreCase(dto.type)) {
//            sendEmail(dto.message); // Placeholder
//        } else if ("SMS".equalsIgnoreCase(dto.type)) {
//            sendSms(dto.message);   // Placeholder
//        }

		return notificationRepository.save(notification);
	}
	
	private void sendEmail(String content, String toEmail) {
        Email from = new Email(sendGridConfig.getFromEmail());
        String subject = "Appointment Notification";
        Email to = new Email(toEmail);
        Content body = new Content("text/plain", content);
        Mail mail = new Mail(from, subject, to, body);

        SendGrid sg = new SendGrid(sendGridConfig.getApiKey());
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println("✅ Email sent: " + response.getStatusCode());
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }

    private void sendSms(String content, String toPhone) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
        Message message = Message.creator(
                new PhoneNumber(toPhone), // To
                new PhoneNumber(twilioConfig.getFromNumber()),
                content
        ).create();
        System.out.println("✅ SMS sent: " + message.getSid());
    }
}
