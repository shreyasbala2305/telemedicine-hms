package com.hms.notificationservice.service;

import java.time.LocalDateTime;
import java.util.List;

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

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SendGridConfig sendGridConfig;

    @Autowired
    private TwilioConfig twilioConfig;

    public Notification send(NotificationDTO dto) {

        log.info(
                "Notification requested. recipientId={}, type={}",
                dto.recipientId,
                dto.type
        );

        Notification notification = new Notification();

        notification.setRecipientId(dto.recipientId);
        notification.setMessage(dto.message);
        notification.setType(dto.type);
        notification.setSentAt(LocalDateTime.now());

        try {

            if ("EMAIL".equalsIgnoreCase(dto.type)) {

                log.debug(
                        "Processing email notification. recipientId={}",
                        dto.recipientId
                );

                sendEmail(
                        dto.message,
                        dto.recipientEmail
                );

            } else if ("SMS".equalsIgnoreCase(dto.type)) {

                log.debug(
                        "Processing SMS notification. recipientId={}",
                        dto.recipientId
                );

                sendSms(
                        dto.message,
                        dto.recipientContact
                );

            } else {

                log.warn(
                        "Unsupported notification type. type={}, recipientId={}",
                        dto.type,
                        dto.recipientId
                );
            }

        } catch (Exception e) {

            log.error(
                    "Failed to process notification. recipientId={}, type={}",
                    dto.recipientId,
                    dto.type,
                    e
            );

            throw e;
        }

        Notification saved =
                notificationRepository.save(notification);

        log.info(
                "Notification recorded successfully. notificationId={}, recipientId={}, type={}",
                saved.getId(),
                saved.getRecipientId(),
                saved.getType()
        );

        return saved;
    }

    private void sendEmail(
            String content,
            String toEmail) {

        log.debug(
                "Sending email notification. recipientId not available"
        );

        Email from =
                new Email(
                        sendGridConfig.getFromEmail()
                );

        String subject =
                "Appointment Notification";

        Email to =
                new Email(toEmail);

        Content body =
                new Content(
                        "text/plain",
                        content
                );

        Mail mail =
                new Mail(
                        from,
                        subject,
                        to,
                        body
                );

        SendGrid sg =
                new SendGrid(
                        sendGridConfig.getApiKey()
                );

        Request request =
                new Request();

        try {

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response =
                    sg.api(request);

            log.info(
                    "Email notification sent successfully. status={}",
                    response.getStatusCode()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send email notification",
                    e
            );

            throw new RuntimeException(
                    "Failed to send email notification",
                    e
            );
        }
    }

    private void sendSms(
            String content,
            String toPhone) {

        try {

            Twilio.init(
                    twilioConfig.getAccountSid(),
                    twilioConfig.getAuthToken()
            );

            Message message =
                    Message.creator(
                            new PhoneNumber(toPhone),
                            new PhoneNumber(
                                    twilioConfig.getFromNumber()
                            ),
                            content
                    ).create();

            log.info(
                    "SMS notification sent successfully. messageSid={}",
                    message.getSid()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send SMS notification",
                    e
            );

            throw new RuntimeException(
                    "Failed to send SMS notification",
                    e
            );
        }
    }

    public List<Notification> getByRecipient(
            Long recipientId) {

        log.debug(
                "Fetching notifications. recipientId={}",
                recipientId
        );

        List<Notification> notifications =
                notificationRepository
                        .findByRecipientId(recipientId);

        log.info(
                "Notifications fetched successfully. recipientId={}, count={}",
                recipientId,
                notifications.size()
        );

        return notifications;
    }
}