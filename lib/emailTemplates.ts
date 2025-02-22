export const participationEmailTemplate = (
  teamName: string,
  teamMembers: string[],
  contactLink: string,
) => {
  // Render the team members section only if there is more than one member
  const teamMembersSection =
    teamMembers.length > 1
      ? `<div style="margin-bottom: 10px;">
      <strong>Team Members:</strong>
      <ul style="list-style-type: none; padding-left: 0;">
        ${teamMembers
          .map(
            (member) =>
              `<li style="font-size: 18px; line-height: 1.5; margin-bottom: 8px;">${member}</li>`,
          )
          .join("")}
      </ul>
    </div>`
      : "";
  return `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333333; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #E6EFFF; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://gdg-on-campus-issatso.tn/logo.png" alt="Choufli Hal 2.0 Logo" style="max-width: 200px; height: auto;">
    </div>
    <div style="padding: 20px;">
      <h1 style="color: #8B3E16; font-size: 24px; margin-bottom: 20px;">Participation Confirmed!</h1>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        Dear participant,<br><br>
        We're excited to confirm your participation in the <strong>Choufli Hal 2.0 Hackathon</strong>! Here are your team details:
      </p>
      <div style="margin-bottom: 10px;">
        <strong>Team Name:</strong> ${teamName}
      </div>
      ${teamMembersSection}
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        If you have any questions or need to update your information, please don't hesitate to reach out to us.
      </p>
      <a href="${contactLink}" style="display: inline-block; background-color: #8B3E16; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Contact Us</a>
    </div>
    <div style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px;">
      <p>&copy; 2025 Choufli Hal Bootcamp 2.0. All rights reserved.</p>
    </div>
  </div>
  `;
};
