# Requirements Document

## Introduction

This feature involves redesigning the user profile page ("Profilim") to improve the layout and user experience. The redesign will maintain the existing functionality while reorganizing the visual elements according to the specified layout requirements. The page will be divided into two main vertical sections: a smaller left section for profile information and a larger right section for detailed personal information.

## Requirements

### Requirement 1

**User Story:** As a user, I want to see my profile information clearly organized in a two-column layout, so that I can easily view and manage my personal details.

#### Acceptance Criteria

1. WHEN the profile page loads THEN the system SHALL display a two-column layout with the left section being narrower than the right section.
2. WHEN viewing the left section THEN the system SHALL display a profile avatar with the user's initial at the top.
3. WHEN viewing the left section THEN the system SHALL display the user's title (e.g., "Dr."), name, and university affiliation below the avatar.
4. WHEN viewing the left section THEN the system SHALL display editable fields for profile photo, email information, phone number, compulsory education status, and other details.

### Requirement 2

**User Story:** As a user, I want to see my detailed personal information in the right section of the profile page, so that I can review all my information at once.

#### Acceptance Criteria

1. WHEN viewing the right section THEN the system SHALL display input fields for first name, last name, email, and phone number at the top.
2. WHEN viewing the right section THEN the system SHALL display input fields for university, faculty, and department in the middle.
3. WHEN viewing the right section THEN the system SHALL display an "Edit Profile" button at the bottom.
4. WHEN viewing the top right corner of the page THEN the system SHALL display a small note saying "Only visible on this screen".

### Requirement 3

**User Story:** As a user, I want the profile page to have a clean and organized layout, so that I can easily navigate and interact with my profile information.

#### Acceptance Criteria

1. WHEN viewing the profile page THEN the system SHALL ensure all boxes, buttons, and labels are aligned neatly and evenly.
2. WHEN viewing the profile page THEN the system SHALL use thin lines for borders around text fields and boxes.
3. WHEN viewing the profile page THEN the system SHALL display text labels in a simple, clear font style.
4. WHEN viewing the profile page THEN the system SHALL maintain proportional sizing between the left and right sections.