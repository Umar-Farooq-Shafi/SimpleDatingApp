import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

import { AuthService } from 'src/app/_service/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userRoles = this.authService.decodedToken.role as Array<string>;

    if (!userRoles) {
      this.viewContainerRef.clear();
    }

    if (this.authService.roleMatch(userRoles)) {
      if (this.isVisible) {
        this.isVisible = false;
        this.viewContainerRef.clear();
      } else {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

}
