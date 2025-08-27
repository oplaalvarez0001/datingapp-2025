import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  protected accountService = inject(AccountService);
  private toast = inject(ToastService);
  protected memberService = inject(MemberService);

  //This is for Approach 1
  // private route = inject(ActivatedRoute);
  // protected member = signal<Member | undefined>(undefined);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: '',
  };

  constructor() {}

  ngOnInit(): void {
    // Approach 1: This is to get the member value from the route data
    // this.route.parent?.data.subscribe({
    //   next: (data) => {
    //     this.member.set(data['member']);
    //   },
    // });
    //     this.editableMember = {
    //   displayName: this.member()?.displayName || '',
    //   description: this.member()?.description || '',
    //   city: this.member()?.city || '',
    //   country: this.member()?.country || '',
    // };
    // A better way to do is is to get the data when the route is activated but instead of pulling the value everytime from the API save the value on a member signal on the member-service
    // and do:

    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    };
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = {
      ...this.memberService.member(),
      ...this.editableMember,
    };
    this.memberService.updateMember(updatedMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName !== currentUser?.displayName) {
          currentUser.displayName = updatedMember.displayName;
          this.accountService.currentUser.set(currentUser);
        }

        this.toast.success('Profile updated successfully', 5000);
        this.memberService.editMode.set(false);
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.resetForm(updatedMember);
      },
      error: () => {
        this.toast.error('Failed to update profile', 5000);
      },
    });
  }
}
